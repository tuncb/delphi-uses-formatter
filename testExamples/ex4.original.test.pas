uses_test a, b, c;

unit ex4;

interface

// This uses should be parsed and correctly sorted.
 uses a, x, b, z, y;

{This uses should be parsed and correctly sorted.}uses b, c, a;
(*This uses should be parsed and correctly sorted.*)uses b, c,a;

implementation

procedure foo();
begin
  // these uses should not be parsed.
  const text = 'not a block: uses d, c, b, a';
end;

end.
