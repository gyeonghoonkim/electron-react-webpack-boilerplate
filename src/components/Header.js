import React, { useEffect, useState } from 'react'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
const { ipcRenderer } = window.require("electron");
import { useDispatch } from 'react-redux';
import { UPDATE_DIRS, updateDirs } from '../redux/reducer';
import { SEARCH_TYPE, setSearchType } from '../redux/reducer';
import Typography from '@mui/material/Typography';


const SearchButton = styled(Button)(({ theme }) => ({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    lineHeight: 1.5,
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    color: '#D1D5DB',
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.8),
        boxShadow: 'none',
        color: '#313348'
    },
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: 10,
    width: 'auto',
    // [theme.breakpoints.up('sm')]: {
    //     marginLeft: theme.spacing(1),
    //     width: 'auto',
    // },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#D1D5DB',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        // [theme.breakpoints.up('sm')]: {
        //     width: '12ch',
        //     '&:focus': {
        //         width: '20ch',
        //     },
        // },
    },
}));


export default function SearchAppBar() {

    const [searchValue, setSearchValue] = useState("")

    const onSearchChange = (e) => {
        setSearchValue(e.target.value)
    }

    const dispatch = useDispatch() // usedispatch라는 Hook는 꼭 여기서 선언해야 한다.

    const onClickSearchButton = () => {
        ipcRenderer.send('search_clicked', { searchValue })
        console.log('button clicked!')

        ipcRenderer.on("send_dirs", (event, payload) => {
            // payload.map((dir) => console.log(dir))
            dispatch(setSearchType("byID"))
            dispatch(updateDirs(payload))
        })
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onClickSearchButton();
        }
    }

    return (
        <>
            <Toolbar disableGutters sx={{ padding: '2px 18px' }}>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon sx={{ color: '#D1D5DB' }} />
                    </SearchIconWrapper>
                    <StyledInputBase
                        onChange={onSearchChange}
                        onKeyDown={handleKeyPress}
                        value={searchValue}
                        placeholder="ID"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
                <SearchButton onClick={onClickSearchButton}>Search</SearchButton>
            </Toolbar>
        </>
    );
}