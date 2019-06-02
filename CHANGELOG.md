
4.2.0
-----
- nested props data mutations, like events being updated,
  will now be rendred on the calendar (#9)
- added missing props (#25, #29)
- the following emitted events are now deprecated.
  use *props* instead. pass in a function as the prop:
    - `datesRender`
    - `datesDestroy`
    - `dayRender`
    - `eventRender`
    - `eventDestroy`
    - `viewSkeletonRender`
    - `viewSkeletonDestroy`
    - `resourceRender`
  Allows returning false/DOM nodes (#27)
- no unnecessary rerendering of calendar caused by header/footer
  props being specified as literals (#11)
- new dependency: fast-deep-equal

4.1.1 (2019-05-14)
------------------
Fix missing option `googleCalendarApiKey` (#12)
