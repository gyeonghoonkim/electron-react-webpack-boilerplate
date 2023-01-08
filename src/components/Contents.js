import React, { useEffect } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
const { ipcRenderer } = window.require("electron");
import { useSelector } from 'react-redux';
const { previewDir } = require("../../utils/preview-dir")
import { useState } from 'react';
import styled from 'styled-components';
import FsLightbox from 'fslightbox-react';
import { AlbumRounded } from '@mui/icons-material';
const path = require('path');
const { divideArray } = require("../../utils/divide-array")
const { indexArray } = require("../../utils/index-array")
import Divider from '@mui/material/Divider';
import AspectRatio from '@mui/joy/AspectRatio';
import { fontSize } from '@mui/system';

function Contents() {

    // State 불러오기
    const directories = useSelector(state => state.dirs)
    const dates = useSelector(state => state.dates)
    const searchedID = useSelector(state => state.searchedID)
    console.log(searchedID)
    const searchedName = useSelector(state => state.searchedName)
    const searchType = useSelector(state => state.searchType)


    const datesIndexArray = indexArray(dates)
    const groupedDates = datesIndexArray[1]

    // 그룹으로 그냥 묶으면 lightbox가 index를 잘 못가져와서, slide 넘버를 같이 데이터로 넘김.
    const groupedDirectories = divideArray(datesIndexArray[0], directories.map((item, idx) => ({ directory: item, slide: idx + 1 })))

    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });

    function openLightboxOnSlide(number) {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    }

    function Album(props) {
        return (
            <>
                <ImageList sx={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px,1fr))!important' }} >
                    {props.dirs.map((data) => (
                        <div key={data.directory} onClick={() => openLightboxOnSlide(data.slide)}>
                            <ImageListItem key={`file:${previewDir(data.directory)}`}>
                                <AspectRatio ratio="16/11">
                                    <img
                                        src={`file:${previewDir(data.directory)}`}
                                        //srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        alt={path.basename(data.directory, ".JPG")}
                                        loading="lazy"
                                    />
                                </AspectRatio>
                                <ImageListItemBar
                                    subtitle={path.basename(data.directory, ".JPG")}
                                    sx={{ textOverflow: 'visible' }}
                                />
                            </ImageListItem>
                        </div>
                    ))}
                </ ImageList>
            </>
        );
    }

    const albums = groupedDirectories.map((dirlist, idx) => (<div key={`albumdiv${idx}`}>
        <p key={`albumname${idx}`} style={{ color: '#bbc0c7', marginTop: '15px', fontSize: 15 }}>{groupedDates[idx]}</p>
        <Album key={`album${idx}`} dirs={dirlist} />
        {dirlist.length !== 0 && <Divider key={`divider${idx}`} sx={{ bgcolor: '#222330' }} />}
    </div>))

    const Title = () => (
        <>
            {directories.length !== 0 && <p style={{ color: '#bbc0c7', marginTop: 0, fontSize: 20, fontWeight: 'bold' }}>
                {(searchType === "byID") ? `검색 결과 (${directories.length}) : ${searchedID} ${searchedName}` : `날짜별 (${directories.length}) : ${dates[0]}`}
            </p>}
        </>
    )

    return (
        <>
            <FsLightbox
                toggler={lightboxController.toggler}
                slide={lightboxController.slide}
                sources={directories.map(dir => `file:${dir}`)}
                thumbs={directories.map(dir => `file:${previewDir(dir)}`)}
                captions={directories.map(dir => path.basename(dir, ".JPG"))}

                exitFullscreenOnClose={true}
                showThumbsOnMount={true}
            />

            <Title />
            {albums}

        </>
    )
}

export default Contents