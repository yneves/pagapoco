
/*
*   Wrapper para facilitar a criação de searchs e queries do elastic search
*   o objeto deve ser criado utilizando esta ferramenta para fazer
*   a busca no firebase através do FireApi
*/

var lodash = {
        arrays: {
            flatten: require('lodash-node/modern/arrays/flatten')
        },
        collections: {
            forEach: require('lodash-node/modern/collections/forEach')
        }
    },
    debug = require('debug')('ElasticSearchDSL.js'),
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
            'term': {}
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
                    'filter': makeSingleFilter(filter.field, filter.data)
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
                            'should': makeMultipleFilters(filters)
                        }
                    }
                }
            }
        };
    },

    // return data based on multiple filters only
    // TODO esta funcionando mas não tenho certeza ainda se os filtros estão realmente top mega foda...
    getByFilter: function (filters) {

        var searchObj,
            rangeFields,
            termFields;
        // # ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-filtered-query.html

        rangeFields = filters.range || null;
        termFields = filters.term || null;
        searchObj = {
            'query': {
                'filtered': {
                    'filter': {}
                }
            }
        };
        debug('começando');
        debug(searchObj);

        if (rangeFields) {
            lodash.collections.forEach(rangeFields, function (data, field) {
                // TODO some logic regarding the fields gte, lte...
            });
        }

        if (termFields) {
            debug('termFields');
            var should = [];
            lodash.collections.forEach(termFields, function (data, field) {
                // field should be 'suppliers' or something
                // data should be an array of values that we want to filter by the current field
                if (data.length === 1) {
                    should.push(makeMultipleFilters(field, data));
                } else if (data.length > 1) {
                    should.push(makeSingleFilter(field, data[0]));
                } else {
                    debug('no filter found');
                }

            });
            // flatten to get all the terms ready
            should = lodash.arrays.flatten(should);

            if (should.length > 1) {
                searchObj.query.filtered.filter = {
                    'bool': {
                        'should': should // an array
                    }
                };
            } else {
                searchObj.query.filtered.filter = should[0]; // an object
            }
        }
        debug('finalizando');
        debug(searchObj);

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
