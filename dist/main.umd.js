(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@fullcalendar/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@fullcalendar/core'], factory) :
  (global = global || self, factory(global.FullCalendarVue = {}, global.FullCalendar));
}(this, function (exports, core) { 'use strict';

  var fullCalendarInputNames = [
      'plugins',
      'header',
      'footer',
      'customButtons',
      'buttonIcons',
      'themeSystem',
      'bootstrapFontAwesome',
      'firstDay',
      'dir',
      'weekends',
      'hiddenDays',
      'fixedWeekCount',
      'weekNumbers',
      'weekNumbersWithinDays',
      'weekNumberCalculation',
      'businessHours',
      'showNonCurrentDates',
      'height',
      'contentHeight',
      'aspectRatio',
      'handleWindowResize',
      'windowResizeDelay',
      'eventLimit',
      'eventLimitClick',
      'timeZone',
      'now',
      'defaultView',
      'allDaySlot',
      'allDayText',
      'slotDuration',
      'slotLabelFormat',
      'slotLabelInterval',
      'snapDuration',
      'scrollTime',
      'minTime',
      'maxTime',
      'slotEventOverlap',
      'listDayFormat',
      'listDayAltFormat',
      'noEventsMessage',
      'defaultDate',
      'nowIndicator',
      'visibleRange',
      'validRange',
      'dateIncrement',
      'dateAlignment',
      'duration',
      'dayCount',
      'locales',
      'locale',
      'eventTimeFormat',
      'columnHeader',
      'columnHeaderFormat',
      'columnHeaderText',
      'columnHeaderHtml',
      'titleFormat',
      'weekLabel',
      'displayEventTime',
      'displayEventEnd',
      'eventLimitText',
      'dayPopoverFormat',
      'navLinks',
      'navLinkDayClick',
      'navLinkWeekClick',
      'selectable',
      'selectMirror',
      'unselectAuto',
      'unselectCancel',
      'defaultAllDayEventDuration',
      'defaultTimedEventDuration',
      'cmdFormatter',
      'defaultRangeSeparator',
      'selectConstraint',
      'selectOverlap',
      'selectAllow',
      'editable',
      'eventStartEditable',
      'eventDurationEditable',
      'eventConstraint',
      'eventOverlap',
      'eventAllow',
      'eventClassName',
      'eventClassNames',
      'eventBackgroundColor',
      'eventBorderColor',
      'eventTextColor',
      'eventColor',
      'events',
      'eventSources',
      'allDayDefault',
      'startParam',
      'endParam',
      'lazyFetching',
      'nextDayThreshold',
      'eventOrder',
      'rerenderDelay',
      'dragRevertDuration',
      'dragScroll',
      'longPressDelay',
      'eventLongPressDelay',
      'droppable',
      'dropAccept'
    ];

    var fullCalendarEventNames = [
      'datesRender',
      'datesDestroy',
      'dayRender',
      'windowResize',
      'dateClick',
      'eventClick',
      'eventMouseEnter',
      'eventMouseLeave',
      'select',
      'unselect',
      'eventRender',
      'eventPositioned',
      'eventDestroy',
      'eventDragStart',
      'eventDragStop',
      'eventDrop',
      'eventResizeStart',
      'eventResizeStop',
      'eventReceive',
      'eventResize',
      'eventLeave',
      'eventResizableFromStart',
      'allDayMaintainDuration',
      'drop'
    ];

  var FullCalendarComponent = {
    props: fullCalendarInputNames,
    calendar: null, // custom prop accessed via this.$options.calendar

    computed: {

      fullCalendarOptions: function fullCalendarOptions() {
        return Object.assign({}, this.fullCalendarInputs, this.fullCalendarEvents)
      },

      fullCalendarInputs: function fullCalendarInputs() {
        var inputHash = {};

        for (var i = 0, list = fullCalendarInputNames; i < list.length; i += 1) {
          var inputName = list[i];

          var val = this[inputName];

          if (val !== undefined) { // wish we didn't have to do this
            inputHash[inputName] = val;
          }
        }

        return inputHash
      },

      fullCalendarEvents: function fullCalendarEvents() {
        var this$1 = this;

        var handlerHash = {};

        var loop = function () {
          var eventName = list[i];

          handlerHash[eventName] = function () {
            var ref;

            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];
            (ref = this$1).$emit.apply(ref, [ eventName ].concat( args ));
          };
        };

        for (var i = 0, list = fullCalendarEventNames; i < list.length; i += 1) loop();

        return handlerHash
      }

    },

    render: function render(createElement) {
      return createElement('div')
    },

    mounted: function mounted() {
      this.$options.calendar = new core.Calendar(this.$el, this.fullCalendarOptions);
      this.$options.calendar.render();
    },

    watch: {
      fullCalendarOptions: function fullCalendarOptions() {
        this.$options.calendar.destroy();
        this.$options.calendar = new core.Calendar(this.$el, this.fullCalendarOptions);
        this.$options.calendar.render();
      }
    },

    beforeDestroy: function beforeDestroy() {
      this.$options.calendar.destroy();
      this.$options.calendar = null;
    }

  };

  // Import vue component

  var installed = false;

  // Declare install function executed by Vue.use()
  function install(Vue) {
  	if (!installed) {
      installed = true;
      Vue.component('FullCalendar', FullCalendarComponent);
    }
  }

  // Auto-install when vue is found (eg. in browser via <script> tag)
  var GlobalVue;
  if (typeof window !== 'undefined') {
  	GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
  	GlobalVue = global.Vue;
  }
  if (GlobalVue) {
  	GlobalVue.use({
      install: install
    });
  }

  exports.default = FullCalendarComponent;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
