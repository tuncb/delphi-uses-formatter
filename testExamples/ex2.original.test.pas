unit ex2;

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

// will not be sorted due to extra k in front
implementation
kuses
  b,
  c,
  f,
  f,
  z,
  g,
  h,
  k,
  l,
  t,
  u,
  y;

{ Will be sorted, uses is preceded by comment block or compiler directive
}uses
  ProjectDB.DelphiFacade.FMDMeshEntityResultData,
  ProjectDB.DelphiFacade.FMDNodeCoordinates,
  ProjectDB.DelphiFacade.FMOMesh,
  ProjectDB.DelphiFacade.FMOMeshEntity,
  ProjectDB.DelphiFacade.FMOMeshEntityPhasesState,
  ProjectDB.DelphiFacade.FMOPhase,
  ProjectDB.DelphiFacade.FMOStep,
  ProjectDB.DelphiFacade.FacadeManagedDataView,
  ProjectDB.DelphiFacade.FacadeManagedDataViewFactory,
  System.SysUtils,
  Xvtkwc.DataArray,
  Xvtkwc.Definitions,
  Xvtkwc.DllLoader,
  Generics.Collections.patched,
  MemoryGuard,
  Optional,
  ProjectDB.DelphiFacade.FMDMeshEntityComponentData,
  Xvtkwc.Piece,
  Xvtkwc.PvdItem,
  Xvtkwc.Writer;

end.