unit ex2;

interface

uses
  b,
{$ifdef FOO}
  f,
{$endif}
{$ifdef FOO}
  f2,
{$else}
  z2,
{$endif}
  unit1,
  unit2,
  x,
  y;

implementation
uses
  b,
{$IFDEF FOO}
  f,
{$ENDIF}
{$ifdef FOO}
  f2,
{$ELSe}
  z2,
{$endif}
  unit1,
  unit2,
  x,
  y;


end.