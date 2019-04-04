/*
FullCalendar Vue Component v4.0.2-beta
Docs: https://fullcalendar.io/docs/vue
License: MIT
*/
import { Calendar } from '@fullcalendar/core';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

/*
the docs point to this file as an index of options.
when this files is moved, update the docs.
*/

/*
TODO: figure out booleans so attributes can be defined like:
<FullCalendar editable />
*/
var INPUT_DEFS = {
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
  datesAboveResources: {}
};
var EVENT_NAMES = ['datesRender', 'datesDestroy', 'dayRender', 'windowResize', 'dateClick', 'eventClick', 'eventMouseEnter', 'eventMouseLeave', 'select', 'unselect', 'loading', 'eventRender', 'eventPositioned', '_eventsPositioned', 'eventDestroy', 'eventDragStart', 'eventDragStop', 'eventDrop', 'eventResizeStart', 'eventResizeStop', 'eventResize', 'drop', 'eventReceive', 'eventLeave', 'viewSkeletonRender', 'viewSkeletonDestroy', '_destroyed', // scheduler...
'resourceRender'];

var FullCalendarComponent = {
  props: INPUT_DEFS,
  calendar: null,
  // accessed via this.$options.calendar
  render: function render(createElement) {
    return createElement('div');
  },
  mounted: function mounted() {
    this.$options.calendar = new Calendar(this.$el, this.fullCalendarOptions);
    this.$options.calendar.render();
  },
  beforeDestroy: function beforeDestroy() {
    this.$options.calendar.destroy();
  },
  watch: {
    fullCalendarOptions: function fullCalendarOptions(options) {
      this.$options.calendar.resetOptions(options);
    }
  },
  computed: {
    fullCalendarOptions: function fullCalendarOptions() {
      return _objectSpread({}, this.fullCalendarInputs, this.fullCalendarEvents);
    },
    fullCalendarInputs: function fullCalendarInputs() {
      var inputHash = {};

      for (var inputName in INPUT_DEFS) {
        var val = this[inputName];

        if (val !== undefined) {
          // unfortunately FC chokes when some props are set to undefined
          inputHash[inputName] = val;
        }
      }

      return inputHash;
    },
    fullCalendarEvents: function fullCalendarEvents() {
      var _this = this;

      var handlerHash = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var eventName = _step.value;

          handlerHash[eventName] = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            _this.$emit.apply(_this, [eventName].concat(args));
          };
        };

        for (var _iterator = EVENT_NAMES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
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

      return handlerHash;
    }
  },
  methods: {
    getApi: function getApi() {
      return this.$options.calendar;
    }
  }
};

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
