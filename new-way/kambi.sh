#!/usr/bin/env bash

function get_events_for_group() {
    group=$1
    curl -s 'https://eu-offering.kambicdn.org/offering/v2018/ubbe/event/group/'"${group}"'.json?includeParticipants=false' \
        | jq '.events[] | select(.tags[] == "MATCH") | .id'
}

get_kambi_for_sportradar_id () {
      curl -s 'https://eu-offering.kambicdn.org/offering/v2018/ubbe/event/livecalendar.json?externalEventProvider=EP_BETRADAR&includeparticipants=false&depth=1' \
      | jq -r '.eventMappings[] | [.externalId, .eventId] | @csv'
}

export -f get_events_for_group
export -f get_kambi_for_sportradar_id
