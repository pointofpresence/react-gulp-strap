React = require 'react'
# Switch this line to `./card-list` to see the simpler panel
Page = require './card-list2'

root = document.getElementById('root')
React.renderComponent(Page(), root)
