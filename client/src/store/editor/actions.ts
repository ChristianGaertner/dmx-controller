export const SELECT_SCENE = "@editor/SELECT_SCENE";

export type EditorAction = SelectScene;

export interface SelectScene {
  type: "@editor/SELECT_SCENE";
  payload: {
    id: string;
  };
}

export const selectSceneForEditing = (id: string) => ({
  type: SELECT_SCENE,
  payload: { id }
});
