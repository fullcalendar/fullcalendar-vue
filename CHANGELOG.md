
4.3.1 (2019-08-12)
------------------
fix regression where object props wrongly forcing rerenders (#11, #34)


4.2.2 (2019-06-04)
------------------
Emergency bugfix: event objects with Date objects wouldn't render


4.2.1 (2019-06-04)
------------------

Fixed bugs surfaced in issue #32:
- event/resource-fetching *functions* don't work
- event/resource *computed properties* don't work
- removed `deep-copy` as a dependency


4.2.0 (2019-06-02)
------------------

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
  automatically bundled with UMD dist


4.1.1 (2019-05-14)
------------------

Fix missing option `googleCalendarApiKey` (#12)
