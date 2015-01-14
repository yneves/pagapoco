pagapoco
========

Pagapo.co stage 1

Coding Guidelines

This codebase is based on the Flux Architecture working with ReactJS.

/actions
Each api file should have an correspondent file in this folder, those files should
be prefixed with "Api" (actions initiated by the server).
The other files can contain code from different components sources (actions initiated
by the player).

/api
Those are the only files that should have access to the files in the /data folder.
The stores should work with this data once they receive a their reference
throught the Dispatcher

/components
ReactJS components

/constants
A list of actions that can be called by the server or player

/data
Those should represent the exact way the data is set in the database. They also
can contain some methods to help manipulate and present data in components

/dispatcher
Flux dispatcher (with some minor upgrades to allow an queue of events)

/stores
Can represent data from many different data sources, each store should work as
a logical container of current visible information in a page. Example:

ProductStore have access to Product and ProductHistory data which it got as a reference
from the dispatcher that was sent by the ActionCreator which was called by the Api.
(sounds hard, but it's not, trust me);

/utils
Generic helper tools
