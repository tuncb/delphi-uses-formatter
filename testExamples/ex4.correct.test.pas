uses_test a, b, c;

unit ex4;

interface

// This uses should be parsed and correctly sorted.
uses
  a,
  b,
  x,
  y,
  z;

{This uses should be parsed and correctly sorted.}
uses
  a,
  b,
  c;
(*This uses should be parsed and correctly sorted.*)
uses
  a,
  b,
  c;

implementation

procedure foo();
begin
  // these uses should not be parsed.
  const text = 'not a block: uses d, c, b, a';
end;

end.
