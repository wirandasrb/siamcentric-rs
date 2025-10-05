"use client";

import { MoreVert } from "@mui/icons-material";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import React from "react";

const Actions = ({ menuList }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const validMenuList = (menuList || []).filter(
        (item) => item && item.label && typeof item.onClick === 'function'
    );

    return (
        <>
            <IconButton
                size="small"
                onClick={handleMenuOpen}
            >
                <MoreVert fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                    '& .MuiMenuItem-root': {
                        '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white'
                        }
                    }
                }}
            >
                {validMenuList.map((item, index) => (
                    <MenuItem key={index}
                        onClick={() => {
                            handleMenuClose();
                            item.onClick();
                        }}>
                        {item?.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                        <ListItemText>{item.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default Actions;