/*
FullCalendar Vue Component v4.2.0
Docs: https://fullcalendar.io/docs/vue
License: MIT
*/
import deepEqual from 'fast-deep-equal';
import deepCopy from 'deep-copy';
import { Calendar } from '@fullcalendar/core';

/*
the docs point to this file as an index of options.
when this files is moved, update the docs.
*/

/*
TODO: figure out booleans so attributes can be defined like:
<FullCalendar editable />
*/
var PROP_DEFS = {
  header: {},
  footer: {},
  customButtons: {},
  buttonIcons: {},
  themeSystem: {},
  bootstrapFontAwesome: {},
  firstDay: {},
  dir: {},
  weekends: {},
  hiddenDays: {},
  fixedWeekCount: {},
  weekNumbers: {},
  weekNumbersWithinDays: {},
  weekNumberCalculation: {},
  businessHours: {},
  showNonCurrentDates: {},
  height: {},
  contentHeight: {},
  aspectRatio: {},
  handleWindowResize: {},
  windowResizeDelay: {},
  eventLimit: {},
  eventLimitClick: {},
  timeZone: {},
  now: {},
  defaultView: {},
  allDaySlot: {},
  allDayText: {},
  slotDuration: {},
  slotLabelFormat: {},
  slotLabelInterval: {},
  snapDuration: {},
  scrollTime: {},
  minTime: {},
  maxTime: {},
  slotEventOverlap: {},
  listDayFormat: {},
  listDayAltFormat: {},
  noEventsMessage: {},
  defaultDate: {},
  nowIndicator: {},
  visibleRange: {},
  validRange: {},
  dateIncrement: {},
  dateAlignment: {},
  duration: {},
  dayCount: {},
  locales: {},
  locale: {},
  eventTimeFormat: {},
  columnHeader: {},
  columnHeaderFormat: {},
  columnHeaderText: {},
  columnHeaderHtml: {},
  titleFormat: {},
  weekLabel: {},
  displayEventTime: {},
  displayEventEnd: {},
  eventLimitText: {},
  dayPopoverFormat: {},
  navLinks: {},
  navLinkDayClick: {},
  navLinkWeekClick: {},
  selectable: {},
  selectMirror: {},
  unselectAuto: {},
  unselectCancel: {},
  defaultAllDayEventDuration: {},
  defaultTimedEventDuration: {},
  cmdFormatter: {},
  defaultRangeSeparator: {},
  selectConstraint: {},
  selectOverlap: {},
  selectAllow: {},
  editable: {},
  eventStartEditable: {},
  eventDurationEditable: {},
  eventConstraint: {},
  eventOverlap: {},
  eventAllow: {},
  eventClassName: {},
  eventClassNames: {},
  eventBackgroundColor: {},
  eventBorderColor: {},
  eventTextColor: {},
  eventColor: {},
  events: {},
  eventSources: {},
  allDayDefault: {},
  startParam: {},
  endParam: {},
  lazyFetching: {},
  nextDayThreshold: {},
  eventOrder: {},
  rerenderDelay: {},
  dragRevertDuration: {},
  dragScroll: {},
  longPressDelay: {},
  eventLongPressDelay: {},
  droppable: {},
  dropAccept: {},
  eventDataTransform: {},
  allDayMaintainDuration: {},
  eventResizableFromStart: {},
  timeGridEventMinHeight: {},
  allDayHtml: {},
  eventDragMinDistance: {},
  eventResourceEditable: {},
  eventSourceFailure: {},
  eventSourceSuccess: {},
  forceEventDuration: {},
  progressiveEventRendering: {},
  selectLongPressDelay: {},
  selectMinDistance: {},
  timeZoneParam: {},
  titleRangeSeparator: {},
  // compound OptionsInput...
  buttonText: {},
  views: {},
  plugins: {},
  // scheduler...
  schedulerLicenseKey: {},
  resources: {},
  resourceLabelText: {},
  resourceOrder: {},
  filterResourcesWithEvents: {},
  resourceText: {},
  resourceGroupField: {},
  resourceGroupText: {},
  resourceAreaWidth: {},
  resourceColumns: {},
  resourcesInitiallyExpanded: {},
  slotWidth: {},
  datesAboveResources: {},
  googleCalendarApiKey: {},
  refetchResourcesOnNavigate: {},
  // used to be emissions but are now props...
  datesRender: {},
  datesDestroy: {},
  dayRender: {},
  eventRender: {},
  eventDestroy: {},
  viewSkeletonRender: {},
  viewSkeletonDestroy: {},
  resourceRender: {}
};
var PROP_IS_DEEP = {
  header: true,
  footer: true,
  events: true,
  eventSources: true,
  resources: true
};
var EMISSION_NAMES = ['windowResize', 'dateClick', 'eventClick', 'eventMouseEnter', 'eventMouseLeave', 'select', 'unselect', 'loading', 'eventPositioned', '_eventsPositioned', 'eventDragStart', 'eventDragStop', 'eventDrop', 'eventResizeStart', 'eventResizeStop', 'eventResize', 'drop', 'eventReceive', 'eventLeave', '_destroyed', // should now be props... (TODO: eventually remove)
'datesRender', 'datesDestroy', 'dayRender', 'eventRender', 'eventDestroy', 'viewSkeletonRender', 'viewSkeletonDestroy', 'resourceRender']; // identify deprecated emissions (TODO: eventually remove)

var EMISSION_USE_PROP = {
  datesRender: true,
  datesDestroy: true,
  dayRender: true,
  eventRender: true,
  eventDestroy: true,
  viewSkeletonRender: true,
  viewSkeletonDestroy: true,
  resourceRender: true
};

/*
VOCAB:
"props" are the values passed in from the parent (they are NOT listeners/emissions)
"emissions" are another way to say "events that will fire"
"options" are the options that the FullCalendar API accepts

NOTE: "deep" props are complex objects that we want to watch for internal changes.
Vue allows a reference to be internally mutated. Each time we detect a mutation,
we use deepCopy to freeze the state. This has the added benefit of stripping the
getter/setter methods that Vue embeds.
*/

var FullCalendarComponent = {
  props: PROP_DEFS,
  // INTERNALS
  // this.$options.calendar
  // this.$options.dirtyOptions - null means no dirty options
  render: function render(createElement) {
    return createElement('div');
  },
  mounted: function mounted() {
    warnDeprecatedListeners(this.$listeners);
    this.$options.calendar = new Calendar(this.$el, this.buildOptions());
    this.$options.calendar.render();
  },
  beforeUpdate: function beforeUpdate() {
    this.renderDirty();
  },
  beforeDestroy: function beforeDestroy() {
    this.$options.calendar.destroy();
  },
  watch: buildWatchers(),
  methods: {
    buildOptions: function buildOptions() {
      var _this = this;

      var options = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var emissionName = _step.value;

          options[emissionName] = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            _this.$emit.apply(_this, [emissionName].concat(args));
          };
        };

        for (var _iterator = EMISSION_NAMES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        } // do after emissions. these props will override emissions with same name

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      for (var propName in PROP_DEFS) {
        var propVal = this[propName];

        if (propVal !== undefined) {
          // NOTE: FullCalendar's API often chokes on undefines
          options[propName] = PROP_IS_DEEP[propName] ? deepCopy(propVal) // NOTE: deepCopy will choke on undefined as well
          : propVal;
        }
      }

      return options;
    },
    renderDirty: function renderDirty() {
      var dirtyOptions = this.$options.dirtyOptions;

      if (dirtyOptions) {
        this.$options.dirtyOptions = null; // clear before rendering. might trigger new dirtiness

        this.$options.calendar.mutateOptions(dirtyOptions, [], false, deepEqual);
      }
    },
    getApi: function getApi() {
      return this.$options.calendar;
    }
  }
};

function buildWatchers() {
  var watchers = {};

  var _loop2 = function _loop2(propName) {
    if (PROP_IS_DEEP[propName]) {
      watchers[propName] = {
        deep: true,
        // listen to children as well
        handler: function handler(newVal, oldVal) {
          recordDirtyOption(this, propName, deepCopy(newVal)); // if the reference is the same, it's an add, remove, or internal mutation. the beforeUpdate hook WON'T fire.
          // otherwise, the beforeUpdate hook WILL fire and cause a rerender

          if (newVal === oldVal) {
            this.renderDirty();
          }
        }
      };
    } else {
      watchers[propName] = function (newVal) {
        recordDirtyOption(this, propName, newVal); // the beforeUpdate hook will render the dirtiness
      };
    }
  };

  for (var propName in PROP_DEFS) {
    _loop2(propName);
  }

  return watchers;
}

function recordDirtyOption(vm, optionName, newVal) {
  (vm.$options.dirtyOptions || (vm.$options.dirtyOptions = {}))[optionName] = newVal;
}

function warnDeprecatedListeners(listenerHash) {
  for (var emissionName in listenerHash) {
    if (EMISSION_USE_PROP[emissionName]) {
      console.warn('Use of ' + emissionName + ' as an event is deprecated. Please convert to a prop.');
    }
  }
}

/*
Registers the component globally if appropriate.
This modules exposes the component AND an install function.

Derived from:
https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html
*/

var installed = false; // declare install function executed by Vue.use()

function install(Vue) {
  if (!installed) {
    installed = true;
    Vue.component('FullCalendar', FullCalendarComponent);
  }
} // detect a globally availble version of Vue (eg. in browser via <script> tag)

var GlobalVue;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
} // auto-install if possible


if (GlobalVue) {
  GlobalVue.use({
    install: install
  });
} // to allow use as module (npm/webpack/etc.) export component

export default FullCalendarComponent;
export { install };
