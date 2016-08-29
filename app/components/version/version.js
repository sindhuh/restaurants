'use strict';

angular.module('datatron.version', [
  'datatron.version.interpolate-filter',
  'datatron.version.version-directive'
])

.value('version', '0.1');
