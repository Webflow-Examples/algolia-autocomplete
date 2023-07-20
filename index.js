// import relevant methods from algolia
const { autocomplete, getAlgoliaResults } = window["@algolia/autocomplete-js"];

// establish connection to your algolia index
const searchClient = algoliasearch(
  // algolia application ID
  "6RJT8M6BD5",
  // algolia search-only API Key
  "113ff52e9d3bd9f965ce3ba85217a2c2"
);

// main element powering autocomplete search
const autocompleteSearch = autocomplete({
  // the element in Webflow to attach the search input to
  container: "#autocomplete",
  // props to pass to autocomplete element
  placeholder: "Spiderman, Batman, etc...",
  autoFocus: true,
  // the items to display
  getSources() {
    return [
      {
        // Unique identifier for the source as you can add multiple sources
        sourceId: "movies",
        //The function called to get the value of an item. The value is used to fill the search box.
        getItemInputValue: ({ item }) => item.query,
        // The function called when the input changes. You can use this function to filter the items based on the query.
        getItems({ query }) {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                // index name
                indexName: "movies",
                query,
                params: {
                  // number of items to show in search dropdown
                  hitsPerPage: 4,
                },
              },
            ],
          });
        },
        //A set of templates to customize how sections and their items are displayed.
        templates: {
          // customize layout for search result item in dropdown when results show
          item({ item, html }) {
            return html`
              <a class="sr-wrap" href="/movies/${item.slug}">
                <div class="sr-image-wrap">
                  <img
                    src="${item.moviePoster}"
                    alt="${item.name}"
                    class="sr-image"
                  />
                </div>
                <div class="sr-content">
                  <p class="sr-title">${item.name}</p>
                  <p class="sr-rating">Rating: ${item.voteAverage}/10</p>
                  <p class="sr-desc">${item.overview}</p>
                </div>
              </a>
            `;
          },
          // show custom UI when there are no results
          noResults({ html }) {
            return html`
              <div class="sr-wrap">
                <div class="sr-content">
                  <p class="sr-title-small">
                    No results found. Try searching something different.
                  </p>
                </div>
              </div>
            `;
          },
        },
        // for keyboard navigation i.e., press Enter to go to page
        getItemUrl({ item }) {
          return "/movies/" + item.slug;
        },
      },
    ];
  },
});
