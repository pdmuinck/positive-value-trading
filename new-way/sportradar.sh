#!/usr/bin/env bash

function get_events_today() {
    curl -s 'https://lsc.fn.sportradar.com/sportradar/en/Europe:Berlin/gismo/event_fullfeed/0/24' \
        | jq -r '.doc
        | .[0].data[].realcategories[].tournaments[]
        | .matches[]
        | ._id'
}

export -f get_events_today
