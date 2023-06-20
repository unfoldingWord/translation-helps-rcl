import { core } from "scripture-resources-rcl";
import { searchCatalogForRepos } from "./network";
import { failIfNull } from '../common/promiseUtil'

const ELLIPSIS = '…';
const DEFAULT_SEPARATOR = ' ';

/**
 * Gets the aligned GL text from the given bible
 * @param {object} contextId
 * @param {object} bible
 * @returns {string}
 */
export function getAlignedTextFromBible(contextId, bible) {
  if (bible && contextId?.reference?.chapter && contextId?.reference?.verse) {
    const verseObjects = bible?.[contextId.reference.chapter]?.[contextId.reference.verse]?.verseObjects;
    if (verseObjects) {
      return getAlignedText(verseObjects, contextId.quote, contextId.occurrence);
    }
  }
}

/**
 * getAlignedText - returns a string of the text found in an array of verseObjects that matches the words to find
 *                  and their occurrence in the verse.
 * @param {Array} verseObjects
 * @param {Array|String} quote
 * @param {int} occurrenceToMatch
 * @param {boolean} isMatch - if true, all verseObjects will be considered a match and will be included in the returned text
 */
export const getAlignedText = (verseObjects, quote, occurrenceToMatch, isMatch=false) => {
  let text = '';

  if (! verseObjects || ! quote || ! occurrenceToMatch) {
    return text;
  }

  const wordsToMatch = getQuoteAsArray(quote, occurrenceToMatch);
  let separator = DEFAULT_SEPARATOR;
  let needsEllipsis = false;

  for (let i = 0, l = verseObjects.length; i < l; i++) {
    const verseObject = verseObjects[i];
    let lastMatch = false;

    if ((verseObject.type === 'milestone' || verseObject.type === 'word')) {
      // It is a milestone or a word...we want to handle all of them.
      if (isMatch || wordsToMatch.find(item => (verseObject.content === item.word) && (verseObject.occurrence === item.occurrence))) {
        lastMatch = true;

        // We have a match (or previously had a match in the parent) so we want to include all text that we find,
        if (needsEllipsis) {
          // Need to add an ellipsis to the separator since a previous match but not one right next to this one
          separator += ELLIPSIS+DEFAULT_SEPARATOR;
          needsEllipsis = false;
        }

        if (text) {
          // There has previously been text, so append the separator, either a space or punctuation
          text += separator;
        }
        separator = DEFAULT_SEPARATOR; // reset the separator for the next word

        if (verseObject.text) {
          // Handle type word, appending the text from this node
          text += verseObject.text;
        }

        if (verseObject.children) {
          // Handle children of type milestone, appending all the text of the children, isMatch is true
          text += getAlignedText(verseObject.children, wordsToMatch, occurrenceToMatch, true);
        }
      } else if (verseObject.children) {
        // Did not find a match, yet still need to go through all the children and see if there's match.
        // If there isn't a match here, i.e. childText is empty, and we have text, we still need
        // an ellipsis if a later match is found since there was some text here
        let childText = getAlignedText(verseObject.children, wordsToMatch, occurrenceToMatch, isMatch);

        if (childText) {
          lastMatch = true;

          if (needsEllipsis) {
            separator += ELLIPSIS+DEFAULT_SEPARATOR;
            needsEllipsis = false;
          }
          text += (text?separator:'') + childText;
          separator = DEFAULT_SEPARATOR;
        } else if (text) {
          needsEllipsis = true;
        }
      }
    }

    if ( lastMatch && verseObjects[i + 1] && verseObjects[i + 1].type === 'text' && text) {
      // Found some text that is a word separator/punctuation, e.g. the apostrophe between "God" and "s" for "God's"
      // We want to preserve this so we can show "God's" instead of "God ... s"
      if (separator === DEFAULT_SEPARATOR) {
        separator = '';
      }
      separator += verseObjects[i + 1].text;
    }
  }
  return text;
};

/**
 * gets the quote as an array of occurrences
 * @param {Array|String} quote
 * @param {int} occurrenceToMatch
 * @return {Array}
 */
export const getQuoteAsArray = (quote, occurrenceToMatch) => {
  let quoteArray = quote;

  if (typeof quote ==='string') { // should only be string in case of single word quote, otherwise is an array
    quoteArray = quote.split(' ');
    quoteArray = quoteArray.map(word => ({ word, occurrence: occurrenceToMatch }));
  }
  return quoteArray;
};

export const loadResourceLink = (resourceReq) =>
  failIfNull({msg: 'load resource link failed', resourceReq}, loadResourceLink_(resourceReq))

/**
 * load the book (in reference) for glBible
 * 
 * @typedef {{resourceLink : ResourceLink, config : APIConfig, reference : Reference}} ResourceReq
 * @param {ResourceReq} resourceReq
 * @return {Promise<{resource: ({parseUsfm}|{manifest}|*), json: *}|null>}
 * @see {@link https://github.com/unfoldingWord/gitea-react-toolkit/tree/master | gitea-react-toolkit for APIConfig}
 * 
 * @todo remove try catch and handle errors correctly
 */
async function loadResourceLink_(resourceReq) {
  try {
    const resource = await core.resourceFromResourceLink(resourceReq)
    if (resource?.manifest && resource?.project?.parseUsfm) { // we have manifest and parse USFM function
      const fileResults = await resource?.project?.parseUsfm()

      //TODO: the failure path here is not handled
      if (fileResults?.response?.status === 200) {
        const json = fileResults?.json;

        if (json) {
          return {
            resource,
            json,
          }
        }
      }
    }
    console.warn(`useContent - invalid resource link ${resourceReq.resourceLink}`)
  } catch (e) {
    console.warn(`useContent - error loading ${resourceReq.resourceLink}`, e)
  }
  return null
}

/**
 * load the manifest of repo to get the relation.  Then parse the relation to get resources that are GL bibles
 * @param {LangId} languageId
 * @param {APIConfig} config - http request configuration
 * @param {string} owner
 * @return {Promise<null| GlBible[]>}
 */
export async function getGlAlignmentBiblesList(languageId, config, owner) {
  
  const results = await core.getResourceManifest({
    username: owner,
    languageId,
    resourceId: 'tw',
    config,
    fullResponse: true,
  }).catch(e => throw new Error({msg: "Loading manifest failed", value: {exception: e, owner,languageId}}))

  const bibleRepos = await searchCatalogForRepos(config.server, config, {
    owner,
    lang: languageId,
    subject: ['Aligned Bible', 'Bible']
  }).catch(e => throw new Error({msg: "Loading catalog failed", value: {exception: e, owner, languageId}}))

  return results?.manifest?.dublin_core?.relation
    .map(repo => repo.split('?')[0].split('/')[1])
    .filter(bible && bible !== 'obs') || [];
}

/**
 * iterate through items adding gl quotes and return new list of items with GL quotes.
 *   To find each GL quote we try each GL bible until a GL quote is found
 * @param {number|string} chapter
 * @param {number|string} verse
 * @param {array} items - list of items from tsv
 * @param {array} glBibles - list of bibles to search for GL quote
 * @return {*[]}
 */
export function addGlQuotesTo(chapter, verse, items, glBibles) {
  const newItems = []

  const reference = {
    chapter,
    verse,
  };

  for (const item of items) {
    const contextId = {
      reference: reference,
      quote: item?.OrigWords,
      occurrence: item?.Occurrence,
    }
    const newItem = {
      ...item,
      glQuote: '',
    }
    newItems.push(newItem)
    for (const glBible of glBibles) {
      const glText = getAlignedTextFromBible(contextId, glBible?.json?.chapters)
      if (glText) {
        newItem.glQuote = glText
        break
      }
    }
  }
  return newItems;
}
