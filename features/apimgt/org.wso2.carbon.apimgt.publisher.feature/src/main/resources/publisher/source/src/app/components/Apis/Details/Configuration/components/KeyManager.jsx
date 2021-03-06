/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import API from 'AppData/api';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

const useStyles = makeStyles((theme) => ({
    expansionPanel: {
        marginBottom: theme.spacing(3),
    },
    expansionPanelDetails: {
        flexDirection: 'column',
    },
    iconSpace: {
        marginLeft: theme.spacing(0.5),
    },
    actionSpace: {
        margin: '-7px auto',
    },
    subHeading: {
        fontSize: '1rem',
        fontWeight: 400,
        margin: 0,
        display: 'inline-flex',
        lineHeight: 1.5,
    },
    keyManagerSelect: {
        minWidth: 180,
    },
}));

/**
 *
 * KeyManager configuration
 * @param {*} props
 * @returns
 */
export default function KeyManager(props) {
    const [keyManagersConfigured, setKeyManagersConfigured] = useState([]);
    const {
        configDispatcher,
        api: { keyManagers, securityScheme },
    } = props;
    const classes = useStyles();
    const handleChange = (event) => {
        const newKeyManagers = [...keyManagers];
        const { target: { checked, name } } = event;
        if (newKeyManagers.indexOf(name) === -1 && checked) {
            newKeyManagers.push(name);
        } else if (newKeyManagers.indexOf(name) !== -1 && !checked) {
            newKeyManagers.splice(newKeyManagers.indexOf(name), 1);
        }
        configDispatcher({
            action: 'keymanagers',
            value: newKeyManagers,
        });
    };
    useEffect(() => {
        API.keyManagers().then((response) => setKeyManagersConfigured(response.body.list));
    }, []);
    if (!securityScheme.includes('oauth2')) {
        return (
            <>
                <Typography className={classes.subHeading} variant='subtitle2'>
                    <FormattedMessage
                        id='Apis.Details.Configuration.components.KeyManager.configuration'
                        defaultMessage='Keymanager Configuration'
                    />
                </Typography>
                <Box ml={1} mb={2}>
                    <Typography className={classes.subHeading} variant='caption'>
                        <FormattedMessage
                            id='Apis.Details.Configuration.components.oauth.disabled'
                            defaultMessage='Key Manager configuration only valid when OAuth2 security is enabled.'
                        />
                    </Typography>
                </Box>
            </>
        );
    }
    return (
        <>
            <Typography className={classes.subHeading} variant='subtitle2'>
                <FormattedMessage
                    id='Apis.Details.Configuration.components.KeyManager.configuration'
                    defaultMessage='Keymanager Configuration'
                />
            </Typography>
            <Box ml={1}>
                <RadioGroup
                    value={keyManagers.includes('all') ? 'all' : 'selected'}
                    onChange={({ target: { value } }) => configDispatcher({
                        action: 'allKeyManagersEnabled',
                        value: value === 'all',
                    })}
                    style={{ flexDirection: 'row' }}
                >
                    <FormControlLabel
                        value='all'
                        control={<Radio />}
                        label={(
                            <FormattedMessage
                                id='Apis.Details.Configuration.components.KeyManager.allow.all'
                                defaultMessage='Allow all'
                            />
                        )}
                    />
                    <FormControlLabel
                        value='selected'
                        control={<Radio />}
                        label={(
                            <FormattedMessage
                                id='Apis.Details.Configuration.components.KeyManager.allow.selected'
                                defaultMessage='Allow selected'
                            />
                        )}
                    />
                </RadioGroup>
                <Box display='flex' flexDirection='row' mb={2}>
                    {!keyManagers.includes('all') && keyManagersConfigured.map((key) => (
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    color='primary'
                                    checked={keyManagers.includes(key.name)}
                                    disabled={!key.enabled}
                                    onChange={handleChange}
                                    name={key.name}
                                />
                            )}
                            label={key.name}
                        />
                    ))}
                </Box>
            </Box>
        </>
    );
}

KeyManager.propTypes = {
    api: PropTypes.shape({}).isRequired,
    configDispatcher: PropTypes.func.isRequired,
};
