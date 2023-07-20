# Algolia Autocomplete in Webflow

A search experience powered by Algolia Autocomplete.

- [Algolia Autocomplete docs](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/)
- Demo Webflow site: [https://algolia-autocomplete-example.webflow.io/](https://algolia-autocomplete-example.webflow.io/)

## How it works

Create the search index in Algolia and populate it with your Webflow CMS data. See this repo (link coming soon) on how it can be done with a script that can be run locally. That repo also explains how data can be kept in sync between the Webflow CMS and Algolia search index database with Webflow webhooks.

Then in Webflow, place a <a href="https://university.webflow.com/lesson/custom-code-embed" target="_blank">custom code embed element</a> inside of a [div block](https://university.webflow.com/lesson/div-block) and give the div block an ID that will be referenced in the Autocomplete setup script. This will attach the Autocomplete search input to the div block on the page.

## Styling

All Algolia CSS classes are pre-fixed with `aa-`. Once the Algolia autocomplete is rendered on the page on the live site, you can poke around by inspecting the page, identifying the Algolia class, and adding your custom styles. This is the approach taken in the `index.css` file part of this repo.

Alternatively, pass the `classNames` prop to the autocomplete element. See the following page for details: [Autocomplete Parameters: classNames](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-classnames).

## Custom elements

The Autocomplete script allows you to define custom <a href="https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/templates/" target="_blank">templates</a> to influence the layout with different areas like each search result or when there are no results. These can be created in Webflow and the HTML can be copied and pasted inside of the script. See the [Components page](https://algolia-autocomplete-example.webflow.io/components) from the demo site.

An example is included below from `index.js`.

```js
// template to render each search item
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
```

## The Javascript

```js
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
```
