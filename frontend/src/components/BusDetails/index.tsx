import React, { useState } from "react";
import { Box, Button, Drawer, IconButton, TextField, Typography, styled, useTheme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import FareBreakDownCard from '../FareBreakdownCard';
import { BusDetailsType } from "../../types";
import { useAuthStore } from "../../store/authStore";
import { useOrderStore } from "../../store/orderStore";

const BusDetails = ({ from, to, disabled, time }: BusDetailsType) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isAddingPassenger, setIsAddingPassenger] = useState(false)
    const [isToasterActive, setIsToasterActive] = useState(false)
    const { isAuth } = useAuthStore();
    const addPassenger = useOrderStore(state => state.addPassenger);
    const { passengerDetail, removePassenger } = useOrderStore();

    const notify = (message: string) => {
        if (!isToasterActive) {
            setIsToasterActive(true);

            toast.error(message, {
                position: 'top-center',
                duration: 3000
            });

            setTimeout(() => {
                setIsToasterActive(false);
            }, 3000);
        }
    }

    const drawerstyle = {
        width: { xs: '100%', sm: '66.6667%' },
        padding: '2rem',
    };

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const handleAddPassenger = (event: React.FormEvent) => {
        event.preventDefault();
        const input = event.target as HTMLInputElement;
        const emailID = input.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern) {
            notify('Invalid email address');
            return;
        }

        if (
            emailID !== '' &&
            passengerDetail.length < 4 &&
            !passengerDetail.some(p => p.emailID === emailID) &&
            !emailID.includes(' ')
        ) {
            addPassenger(emailID);
            input.value = '';
            setIsAddingPassenger(false);
            useOrderStore.setState(state => ({
                ticketQuantity: state.ticketQuantity + 1
            }));
        }
    }

    const handleRemovePassenger = (emailID: string) => {
        removePassenger(emailID);
        useOrderStore.setState(state => ({
            ticketQuantity: state.ticketQuantity - 1,
        }));
    }

    const bookTicketHandler = () => {
        if (!isAuth) {
            notify('Please login to book a ticket');
            return;
        }
        useOrderStore.setState(state => ({
            ...state,
            source: from,
            destination: to,
            time: time
        }));
    }

    const Details = styled(Box)`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        margin: 2rem 0;
        padding: 1.5rem;
    `;

    const PassengersContainer = styled(Box)`
        display: flex;;
        flex-direction: column;
        gap: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        margin: 2rem 0;
        padding: 1rem;
        min-height: 20vh;
    `;

    const AddPassengerButton = styled(Button)`
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, 0.5);
        min-width: max-content;

        &:hover {
            color: rgba(0, 0, 0, 0.5);
            background-color: transparent;
        }
    `;

    const AddPassengerIcon = styled(AddIcon)`
        border: 1px solid rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        padding: 2px;
    `;

    const CrossIcon = styled(CloseIcon)`
        border: 1px solid rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        padding: 2px;
    `;

    const CustomTextField = styled(TextField)`
        .MuiInput-underline:after {
            border-bottom-color: rgba(0, 0, 0, 0.5);
        }

        .MuiFormLabel-root.Mui-focused {
            color: rgba(0, 0, 0, 0.7);
        }

        .MuiFormLabel-root {
            font-size: 16px;
        }

        @media (max-width: 600px) {
            .MuiFormLabel-root {
            font-size: 12px;
            }
        }

        margin: 0;
    `;

    return (
        <>
            <Button
                variant="contained"
                disabled={disabled} startIcon={<ConfirmationNumberIcon />}
                onClick={bookTicketHandler}
                sx={{
                    padding: '0.5vw 1.2vw',
                    fontSize: { xs: '10px', sm: '12px', md: '15px' },
                    minWidth: 'max-content',
                    '&:hover': {
                        backgroundColor: '#FBBC05',
                    },
                }}
            >
                Book ticket
            </Button>
            <Drawer>
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
                >
                    <IconButton
                        onClick={closeDrawer}
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                        size="small"
                    >
                        <CrossIcon sx={{ fontSize: { md: '1rem' } }} />
                    </IconButton>
                </Box>
                <Box>
                    <Typography
                        variant="h2"
                        fontSize={{ xs: '1.5rem', sm: '1.75rem', md: '2rem' }}
                        color={theme.palette.secondary.main}
                    >
                        Bus Details
                    </Typography>
                    <Details sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                        {/* <BusDetailsCard /> */}
                    </Details>
                </Box>
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            fontSize={{ xs: '1.5rem', sm: '1.75rem', md: '2rem' }}
                            variant="h2"
                            color={theme.palette.secondary.main}
                        >
                            Passenger Details
                        </Typography>
                        {
                            !isAddingPassenger ? (
                                <AddPassengerButton
                                    variant="text"
                                    style={{ display: passengerDetail.length === 4 ? 'none' : "flex" }}
                                    onClick={() => setIsAddingPassenger(true)}
                                >
                                    <Typography
                                        variant="h6"
                                        color={theme.palette.common.black}
                                        textTransform="none"
                                        sx={{
                                            display: { xs: 'none', sm: 'block' },
                                            marginLeft: '0.5rem',
                                        }}
                                    >
                                        Add a new passenger
                                    </Typography>
                                    <AddPassengerIcon sx={{ fontSize: { md: '1rem' } }} />
                                </AddPassengerButton>
                            ) : (
                                <IconButton
                                    onClick={() => setIsAddingPassenger(false)}
                                    size="small"
                                >
                                    <CrossIcon sx={{ fontSize: { md: '1rem' } }} />
                                </IconButton>
                            )
                        }
                    </Box>
                    <PassengersContainer>
                        {passengerDetail.map((passenger, index) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="h6" color={theme.palette.secondary.main}>
                                    {index + 1}. {passenger.emailID}
                                </Typography>
                                <IconButton
                                    onClick={() => handleRemovePassenger(passenger.emailID)}
                                    size="small"
                                >
                                    <CrossIcon sx={{ fontSize: { md: '1rem' } }} />
                                </IconButton>
                            </Box>
                        ))}
                        {!isAddingPassenger ? (
                            passengerDetail.length === 0 && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '20vh',
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        color={theme.palette.common.black}
                                        fontSize={{ xs: '1rem', md: '1.25rem' }}
                                    >
                                        No Passengers are added currently
                                    </Typography>
                                </Box>
                            )
                        ) : (
                            <form onSubmit={handleAddPassenger}>
                                <CustomTextField
                                    label="Write passenger’s Email ID"
                                    variant="standard"
                                    fullWidth
                                    onKeyDown={event => {
                                        if (event.key === 'Enter') {
                                            handleAddPassenger(event);
                                        }
                                    }}
                                    onBlur={event => handleAddPassenger(event)}
                                />
                            </form>
                        )}
                    </PassengersContainer>
                </Box>
                <Box>
                    <Typography
                        variant="h2"
                        fontSize={{ xs: '1.5rem', sm: '1.75rem', md: '2rem' }}
                        color={theme.palette.secondary.main}
                    >
                        Fare Breakdown
                    </Typography>
                    <FareBreakDownCard />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginTop: '2rem',
                    }}
                >
                    <Button
                        variant="contained"

                        sx={{
                            padding: '0.5rem 2rem',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main,
                            },
                        }}
                    >
                        Pay Now
                    </Button>
                    <Toaster />
                </Box>
            </Drawer>
        </>
    )
}

export default BusDetails;