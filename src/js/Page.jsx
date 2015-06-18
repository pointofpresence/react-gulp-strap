/** @jsx React.DOM */

var React = require("react");
var Panel = require("react-bootstrap").Panel;

module.exports = React.createClass({
    render: function () {
        return (
            <div className="list">
                <Panel header="First panel">
                    I am a Panel
                </Panel>

                <Panel header="Second panel">
                    I am another Panel with an icon&nbsp;
                    <i className="fa fa-diamond" />
                </Panel>
            </div>
        );
    }
});