unit ex1;

interface

uses
  b,x,y,
{$ifdef FOO}
  f,
{$endif}
  unit1,
  unit2,
{$ifdef FOO}
  f2;
{$else}
  z2;
{$endif}

implementation
uses
  b,x,y,
{$IFDEF FOO}
  f,
{$ENDIF}
  unit1,
  unit2,
{$ifdef FOO}
  f2;
{$ELSe}
  z2;
{$endif}


end.