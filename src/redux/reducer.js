// type string 관리
export const UPDATE_DIRS = "UPDATE_DIRS";
export const MAKE_FOLDER_TREE = "MAKE_FOLDER_TREE";
export const SEARCH_TYPE = "SEARCH_TYPE";

// Action Creater

export const updateDirs = data => ({
    type: UPDATE_DIRS,
    data
})

export const makeFolderTree = data => ({
    type: MAKE_FOLDER_TREE,
    data
})

export const setSearchType = data => ({
    type: SEARCH_TYPE,
    data
})

const initalState = {
    dates: [],
    dirs: [],
    searchedID: "",
    searchedName: "",
    folderTree: {},
    searchType: "byID"
};

const reducer = (state = initalState, action) => {
    switch (action.type) {
        case UPDATE_DIRS:
            return {
                ...state,
                dates: action.data[0],
                dirs: action.data[1],
                searchedID: action.data[2],
                searchedName: action.data[3]

            }
        case MAKE_FOLDER_TREE:
            return {
                ...state,
                folderTree: action.data
            }
        case SEARCH_TYPE:
            return {
                ...state,
                searchType: action.data
            }
        // default를 쓰지 않으면 맨처음 state에 count값이 undefined가 나옵니다 꼭! default문을 넣으세요
        default:
            return state;
    }
};

export default reducer;