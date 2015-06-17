React = require 'react'
{Panel} = require 'react-bootstrap'


module.exports = React.createClass
  render: ->

    <div className="card-list">
      <Panel header="Hello There!">
        I am a Panel
      </Panel>
      <Panel header="Hello There Again">
        I am another Panel with simple HTML element and an icon <i className="fa fa-diamond" />
      </Panel>
    </div>
