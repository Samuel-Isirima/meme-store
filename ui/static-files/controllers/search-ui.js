const selectedTag_UI = (tag) =>
{
return ` <span class="tss-0 selected-tag" tag="${tag}" id="tag-${tag}">${tag}  <span class="rtag" tag="${tag}">x</span> </span>`

}

const tagSearchSuggestionUI = (tag) =>
{
return ` <span class="tss-0 tss013 tag-search-suggestion-result suggested-tag" tag="${tag}" id="tag-${tag}">${tag}</span>
    `

}