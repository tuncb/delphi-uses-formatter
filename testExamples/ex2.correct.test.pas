unit ex1;

interface

uses
  b,
  c,
  f,
  f,
  g,
  h,
  k,
  l,
  t,
  u,
  y;

// will not be sorted due to extra k in front of uses
implementation
kuses
  b,
  c,
  f,
  f,
  g,
  h,
  k,
  l,
  t,
  u,
  y;

// Will not be sorted, because it does not follow a valid interface/implementation section definition
uses
  Generics.Collections.patched,
  MemoryGuard,
  Optional,
  ProjectDB.DelphiFacade.FacadeManagedDataView,
  ProjectDB.DelphiFacade.FacadeManagedDataViewFactory,
  ProjectDB.DelphiFacade.FMDMeshEntityComponentData,
  ProjectDB.DelphiFacade.FMDMeshEntityResultData,
  ProjectDB.DelphiFacade.FMDNodeCoordinates,
  ProjectDB.DelphiFacade.FMOMesh,
  ProjectDB.DelphiFacade.FMOMeshEntity,
  ProjectDB.DelphiFacade.FMOMeshEntityPhasesState,
  ProjectDB.DelphiFacade.FMOPhase,
  ProjectDB.DelphiFacade.FMOStep,
  System.SysUtils,
  Xvtkwc.DataArray,
  Xvtkwc.Definitions,
  Xvtkwc.DllLoader,
  Xvtkwc.Piece,
  Xvtkwc.PvdItem,
  Xvtkwc.Writer;

end.