var Store =
    React.createClass({
        render: function (){
            return (
                <div className="page">
                    <Header />
                    <div className="page-body">
                        <div>
                            <Products />
                        </div>
                    </div>
                </div>
            );
        }
    });

module.exports = Store;