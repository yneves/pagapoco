
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
                            <div className="col-xs-offset-9 col-xs-3" id="logoLogin">
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
                            <Icon className='loginIcon' icon="action-search" />
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

                            <section className='pageSection row' id='homeCats'>
                                <h3>PRINCIPAIS CATEGORIAS</h3>
                                <div className='col-xs-4 catSingleHome'></div>
                                <div className='col-xs-4 catSingleHome'></div>
                                <div className='col-xs-4 catSingleHome'></div>
                            </section>

                            <section className='pageSection' id='homeLists'>
                            </section>
                        </div>
                    </div>
                </div>
            );
        }
    });
