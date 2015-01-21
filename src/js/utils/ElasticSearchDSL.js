
/*
*   Wrapper para facilitar a criação de searchs e queries do elastic search
*   o objeto deve ser criado utilizando esta ferramenta para fazer
*   a busca no firebase através do FireApi
*/

var debug = require('debug')('ElasticSearchDSL.js'),
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
    getBySingleFilter: function (term) {
        // # ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-term-query.html
        return {
            'query': {
                'term': {
                    'supplier': {
                        'value': term,
                        'boost': 2.0
                    }
                }
            }
        };
    },
    getByMultipleFilter: function (terms) {
        // # ref http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html
        // it works, but not for multiple different terms as it seems.. must dig further
        return {
            'query': {
                'terms': {
                    'supplier': ['integralmedica', 'probiotica'],
                    'minimum_should_match': 1
                }
            }
        };
    }
};

module.exports = ElasticSearchDSL;
