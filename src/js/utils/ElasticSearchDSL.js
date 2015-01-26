
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

// this is in order to cover cases with hyphen, bellow are a link describing
// the problem and one possible solution
// http://stackoverflow.com/questions/11566838/elastic-search-hyphen-issue-with-term-filter
function handleHyphenFilter(field, data) {
    var filterObject,
        arrayComplex = [];
    lodash.collections.forEach(data, function (value) {
        filterObject = {
            'term' : {}
        };
        filterObject.term[field] = value;
        arrayComplex.push(filterObject);
    });
    return arrayComplex;
}

// for simple cases (single filters)
function makeSingleFilter(field, data) {
    var filterObject,
        returned;

    if (typeof field !== 'string' || typeof data !== 'string') {
        throw new TypeError('You must send field/data of type string');
    }

    returned = data.split('-');
    if (returned.length <= 1) {
        filterObject = {
            'term': {}
        };
        filterObject.term[field] = {
            'value': returned[0]
        };
    } else {
        filterObject = handleHyphenFilter(field, returned);
    }
    return filterObject;
}

// for multiple filters cases
function makeMultipleFilters(field, data) {
    var filterObject;
    filterObject = [];
    lodash.collections.forEach(data, function (value) {
        filterObject.push(makeSingleFilter(field, value));
    });
    return filterObject;
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
    getQueryWithSingleFilter: function (term, filter) {
        var searchObj;

        searchObj = {
            'query': {
                'filtered': {
                    'query': {
                        'match': {
                            'title': term
                        }
                    },
                    'filter': makeSingleFilter('supplier', filter)
                }
            }
        };

        return searchObj;
    },
    // return data bsed on query with possible multiple filters
    getQueryWithMultipleFilters: function (term, filters) {
        var searchObj;
        // #ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-filtered-query.html

        searchObj = {
            'query': {
                'filtered': {
                    'query': {
                        'match': {
                            'title': term
                        }
                    },
                    'filter': {
                        'bool': {
                            'should': makeMultipleFilters('supplier', filters)
                        }
                    }
                }
            }
        };
    },

    // return data based on filter only, the complex/simple cases scenarios were
    // created due to the way data was indexed with elasticsearch + flashlight
    getBySingleFilter: function (filter) {
        // #ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-term-query.html
        // #ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-filtered-query.html
        var searchObj;

        searchObj = {
            'query': {
                'filtered': {
                    'filter': makeSingleFilter('supplier', filter)
                }
            }
        };

        return searchObj;
    },

    // return data based on multiple filters only
    // TODO esta funcionando mas não tenho certeza ainda se os filtros estão realmente top mega foda...
    getByMultipleFilter: function (filters) {

        var searchObj;
        // # ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-filtered-query.html
        // it works, but not for multiple different terms as it seems.. must dig further

        searchObj = {
            'query': {
                'filtered': {
                    'filter': {
                        'bool': {
                            'should': makeMultipleFilters('supplier', filters)
                        }
                    }
                }
            }
        };

        return searchObj;
    },

    testRangeFilter: function () {

        var searchObj;

        searchObj = {
            'query': {
                'filtered': {
                    'filter': {
                        'range': {
                            // TODO make sure the types are correct, if it was saved as string it won't worki
                            'offers.best_offer.price.value': {
                                'gte': 100
                            }
                        }
                    }
                }
            }
        };

        return searchObj;
    },
};

module.exports = ElasticSearchDSL;
