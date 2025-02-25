A specific point in time defined as ISO 8601 combined date and time representation. It must contain timezone information, either `Z` for UTC or a zone offset. 
Optionally, it can contain an IANA zone id.

- `2019-10-01T12:00:00Z` - UTC time
- `2019-10-02T08:09:40+02:00` - UTC plus two hours zone offset
- `2019-10-02T08:09:40[Europe/Berlin]` - zone id for Berlin (plus one hour offset from UTC)

:::note
Camunda deviates slightly from ISO 8601 in that ALL Camunda times must have a timezone. 
If you don't specify a timezone then Camunda interprets the time as UTC on your behalf.
So, if you type `2019-10-02T08:09:40` then it will be interpreted as `2019-10-02T08:09:40Z`.
Whereas, ISO 8601 says "If no UTC relation information is given with a time representation, the time is assumed to be in local time."
:::

Although not strictly supported by ISO 8601 Camunda does support IANA timezones (e.g. `[Europe/Berlin]` as above).
Use either an ISO 8601 offset or an IANA timezone - if you use both then the outcome is undefined.

:::note
Since all times in Camunda must have a timezone then Camunda isn't able to follow Daylight Savings Time (DST).

For example if you set a timer start event as `2019-10-02T15:21:33+01:00` then it will fire at `14:21:33` UTC, or `15:21:33` in Berlin (in the winter).
In the summer the timer it will still fire at `14:21:33` UTC, but now this will be `16:21:33` local time in Berlin (or `16:21:33+02:00`). 
:::
