React = require 'react'
{Panel} = require 'react-bootstrap'


TogglePanel = React.createClass

  getInitialState: ->
    showFirstPanel: true

  render: ->
    if @state.showFirstPanel
      <Panel header="Hello There!" bsStyle="primary" onClick={@onShowSecondPanel}>
        I am the first Panel. Click me to show the Second Panel
      </Panel>

    else
      <Panel header="Hello There Again" onClick={@onShowFirstPanel}>
        I am the second Panel. Click me to show the First Panel. And here is an icon:
        <i className="fa fa-diamond" />
      </Panel>

  onShowFirstPanel:  -> @setState {showFirstPanel: true}
  onShowSecondPanel: -> @setState {showFirstPanel: false}


module.exports = TogglePanel
