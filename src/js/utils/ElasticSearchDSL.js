
/*
*   Wrapper para facilitar a criação de searchs e queries do elastic search
*   o objeto deve ser criado utilizando esta ferramenta para fazer
*   a busca no firebase através do FireApi
*/

var debug = require('debug')('ElasticSearchDSL.js'),
    lodash = {
        collections: {
            forEach: require('lodash-node/modern/collections/forEach')
        }
    },
    ElasticSearchDSL;

// *** ATTENTION *** ATTENZIONE ** ATENÇÃO ** WARNING ** MUHABADU!
// not using matchWholeWords on certain searchs may result in no data getting
// returned since it will try to append * before and * after the term
// Searchs for fields like supplier, etc may get not result because of that

function makeTerm(term, matchWholeWords) {
    // more about wildcards
    // #ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html
    if( !matchWholeWords ) {
        // if( !term.match(/^\*/) ) { term = '*'+term; }
        if( !term.match(/\*$/) ) { term += '*'; }
    }
    debug(term);
    return term;
}

ElasticSearchDSL = {
    getDefaultShittyQuery: function (shittyTerm) {
        return {
            'query': {
                'query_string': {
                    'query': makeTerm(shittyTerm, false)
                },
            }
        };
    },
    getMatch: function (term, words) {
        words = words || true;
        return {
            'query': {
                'match': {
                    'title': makeTerm(term, words)
                }
            }
        };
    },
    getMultiMatch: function (term, words) {
        words = words || true;
        // TODO chaos here! look away!
        return {
            'query': {
                'bool' : {
                    'should': [
                        {
                            'multi_match': {
                                'query': makeTerm(term, true),
                                'type': 'most_fields',
                                'fields': ['supplier', 'title']
                            }
                        },
                        {
                            'multi_match': {
                                'query': makeTerm(term, false),
                                'type': 'most_fields',
                                'fields': ['title', 'supplier']
                            }
                        }
                    ]
                }
            }
        };
    },
    // return data based on query with one filter only
    getQueryWithSingleFilter: function (term) {
        var searchObj;

        searchObj = {
            'query': {
                'filtered': {
                    'query': {

                    },
                    'filter': {

                    }
                }
            }
        };

        return searchObj;
    },
    // return data bsed on query with possible multiple filters
    getQueryWithMultipleFilters: function (term) {
        var searchObj;
        // #ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-filtered-query.html

        searchObj = {
            'query': {
                'filtered': {
                    'query': {

                    },
                    'filter': {

                    }
                }
            }
        };
    },

    // return data based on filter only, the complex/simple cases scenarios were
    // created due to the way data was indexed with elasticsearch + flashlight
    // this is in order to cover cases with hyphen, bellow are a link describing
    // the problem and one possible solution
    // http://stackoverflow.com/questions/11566838/elastic-search-hyphen-issue-with-term-filter
    getBySingleFilter: function (filter) {
        // #ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-term-query.html
        // #ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-filtered-query.html
        var searchObj;

        var returned = filter.split('-');

        // for simple cases
        if (returned.length <= 1) {
            searchObj = {
                'query': {
                    'filtered': {
                        'filter': {
                            'term': {
                                'supplier': {
                                    'value': returned[0]
                                }
                            }
                        }
                    }
                }
            };
        } else {
            // for complex cases
            searchObj = {
                'query': {
                    'filtered': {
                        'filter': {
                            'bool': {
                                'must': []
                            }
                        }
                    }
                }
            };

            lodash.collections.forEach(returned, function (value) {
                searchObj.query.filtered.filter.bool.must.push({
                    'term': { 'supplier': value }
                });
            });

        }
        debug(searchObj);
        return searchObj;
    },
    // return data based on multiple filters only
    getByMultipleFilter: function (filters) {
        // # ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-filtered-query.html
        // it works, but not for multiple different terms as it seems.. must dig further
        return {
            'query': {
                'filtered': {
                    'filter': {
                        'terms': {
                            'supplier': ['integralmedica', 'probiotica'],
                            'minimum_should_match': 1
                        }
                    }
                }
            }
        };
    }
};

module.exports = ElasticSearchDSL;
