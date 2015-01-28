
var React = require('react'),
    MUI = require('material-ui');
    Icon = MUI.Icon;

module.exports = 
    React.createClass({
        render: function (){
            return (
                <div>
                    <header className='headerHome'>
                        <div className='headerContent wrap container-fluid'>
                            <div className="col-xs-offset-9 col-xs-3" class="logoLogin">
                                <span><Icon className='loginIcon' icon="action-account-circle" /> Entrar / Registrar</span>
                            </div>
                            <div className='row center-xs' id="logoHome">
                                <img src='../../assets/icons/logohome.png'/>
                            </div>
                        </div>
                    </header>
                    <div className='row center-xs' id="searchHome">
                        <input
                            id='inputSearchHome'
                            type="text"
                            placeholder='Em que Pagar po.co hoje?'
                            ref="input" />
                        <button type="button" className='searchButton'>
                            <Icon className='searchIcon' icon="action-search" />
                        </button>
                    </div>
                    <div className='searchcolorbar'>
                        <span className='bar1'></span>
                        <span className='bar2'></span>
                        <span className='bar3'></span>
                        <span className='bar4'></span>
                        <span className='bar5'></span>
                    </div>
                    <div className='page'>
                        <div className="wrap container-fluid">

                            <section className='pageSection' id='homeCats'>
                                <h3>PRINCIPAIS CATEGORIAS</h3>
                                <div className='row'>
                                    <div className='col-xs-4'>
                                        <div className="catSingleHome center-xs">
                                            <img className='' src="
                                                 http://thumbs.buscape.com.br/suplemento/esportivo-universal-nutrition-ultra-whey-pro-pote-po-2270-gramas_300x300-PU62e21_1.jpg
                                            " />
                                            <h4>Whey</h4>
                                        </div>
                                    </div>
                                    <div className='col-xs-4'>
                                        <div className="catSingleHome center-xs">
                                            <img className='middle-xs' src="
                                                http://thumbs.buscape.com.br/suplemento/esportivo-integralmedica-creatina-pote-60-capsulas_300x300-PU696df_1.jpg
                                             " />
                                            <h4>Creatina</h4>
                                        </div>
                                    </div>
                                    <div className='col-xs-4'>
                                        <div className="catSingleHome center-xs">
                                            <img className='middle-xs' src="
                                                http://thumbs.buscape.com.br/suplemento/esportivo-optimum-nutrition-bcaa-1000-pote-400-capsulas_300x300-PU67748_1.jpg
                                             " />
                                            <h4>BCAA</h4>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className='pageSection' id='homeLists'>
                                <h3>LISTAS MAIS POPULARES</h3>
                                    <div className='row'>
                                        <div className='col-xs-12'>
                                            <ul id='ulHome'>
                                                <li className='row'>
                                                    <span className='col-xs-7 listTitle'>
                                                    Começando a Malhar
                                                    <p className='listTax'>em Suplementos</p>
                                                    </span>

                                                    <span className='col-xs-3 listBy top-xs'>
                                                    Criada por
                                                        <p className='listByName'>Pato von Duck</p>
                                                    </span>

                                                    <span className='col-xs-2'>
                                                        <span className='starCount'> 213 <Icon className='starCountIcon' icon="action-stars" /></span>
                                                    </span>

                                                </li>

                                                <li className='row'>
                                                    <span className='col-xs-7 listTitle'>
                                                    Começando a Malhar
                                                        <p className='listTax'>em Suplementos</p>
                                                    </span>

                                                    <span className='col-xs-3 listBy top-xs'>
                                                    Criada por
                                                        <p className='listByName'>Pato von Duck</p>
                                                    </span>

                                                    <span className='col-xs-2'>
                                                        <span className='starCount'> 213 <Icon className='starCountIcon' icon="action-stars" /></span>
                                                    </span>

                                                </li>

                                                <li className='row'>
                                                    <span className='col-xs-7 listTitle'>
                                                    Começando a Malhar
                                                        <p className='listTax'>em Suplementos</p>
                                                    </span>

                                                    <span className='col-xs-3 listBy top-xs'>
                                                    Criada por
                                                        <p className='listByName'>Pato von Duck</p>
                                                    </span>

                                                    <span className='col-xs-2'>
                                                        <span className='starCount'> 213 <Icon className='starCountIcon' icon="action-stars" /></span>
                                                    </span>

                                                </li>

                                                <li className='row'>
                                                    <span className='col-xs-7 listTitle'>
                                                    Começando a Malhar
                                                        <p className='listTax'>em Suplementos</p>
                                                    </span>

                                                    <span className='col-xs-3 listBy top-xs'>
                                                    Criada por
                                                        <p className='listByName'>Pato von Duck</p>
                                                    </span>

                                                    <span className='col-xs-2'>
                                                        <span className='starCount'> 213 <Icon className='starCountIcon' icon="action-stars" /></span>
                                                    </span>

                                                </li>

                                                <li className='row'>
                                                    <span className='col-xs-7 listTitle'>
                                                    Começando a Malhar
                                                        <p className='listTax'>em Suplementos</p>
                                                    </span>

                                                    <span className='col-xs-3 listBy top-xs'>
                                                    Criada por
                                                        <p className='listByName'>Pato von Duck</p>
                                                    </span>

                                                    <span className='col-xs-2'>
                                                        <span className='starCount'> 213 <Icon className='starCountIcon' icon="action-stars" /></span>
                                                    </span>

                                                </li>

                                                <li className='row'>
                                                    <span className='col-xs-12 center-xs' id='createList'>+ CRIE SUA LISTA</span>
                                                </li>

                                            </ul>
                                         </div>
                                    </div>
                                </section>
                        </div>
                    </div>
                </div>
            );
        }
    });
