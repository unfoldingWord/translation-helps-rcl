/**
 * This module encodes the GlBible type which encapsulates strings of the format: `${languageId}_${bibleName}`
 * 
 * A glBible is a repository
 * 
 * @module core/glBible 
 * 
 * @typedef {string} ResourceLink a valid url path pointing to a Bible resource
 * @typedef {string} GlBible the name of a glBible (e.g: "hi_gst")
 * @typedef {string} LangId 
 * @typedef {string} BibleName 
 * @typedef {string} Owner 
 * 
 * @todo see `dublin_core` standard for `manifest.yaml` file
 * @todo see Rich Mahn about documentation for how a glBible is encoded (and what tsv files are and what usfm files are)
 * @todo talk to bruce speidel about a knowledge graph
 * @see {@link https://resource-container.readthedocs.io/en/v0.2/manifest.html | Resource Container Documentation}
 * 
 */

/** 
 * @param {GlBible} glBible
 * @param {Owner} owner the owner of a repository (e.g: 'Door43-Catalog')
 * @returns {ResourceLink} the resource link for the glBible
 * @todo TEST!
 * @todo note that the ref has been hard coded to `master`
 */
export const resourceLink = (owner, languageId, repoName) => 