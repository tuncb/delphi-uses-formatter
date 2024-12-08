# Change Log
All notable changes to the "pascal-uses-formatter" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.5.0]
 - Add replacing old style short unit names with longer forms.

## [0.4.2]
 - Do not sort when the block has unsupported comments and ifdefs in it.

## [0.4.1]
 - Fix parsing issues related to comments.
 - Better uses section creation: Trim whitespace, start of a new line if the section starts after comments.

## [0.4.0]
 - Add new formatting style comma at the beginning. Thanks to radkomoder.

## [0.3.4]
 - Fix sorting when uses keyword is not used as a whole word.

## [0.3.3]
 - Fix sorting when uses keyword is not used as a whole word. Thanks to daveweij.

## [0.3.2]
 - Dependency update.

## [0.3.0]
 - Add option overrideSortingOrder to override sort order for user selected units. Thanks to kvrabec.

## [0.2.2]
 - Do not sort files that do not have pascal or objectpascal language id automatically on save

## [0.2.1]
 - Fixed security warnings related to the minimist package

## [0.2.0]
 - Remove BETA warning message, we only show a message when no uses section can be found

## [0.1.0]
 - Add setting pascal-uses-formatter.formatOnSave

## [0.0.5]
 - Fixed extra new line inserted at the end of uses sections
 - Fixed case sensitive sorting of units

## [0.0.4]
- Initial release