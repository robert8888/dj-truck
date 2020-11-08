import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {Dropdown, DropdownButton as BootstrapDropdownButton} from "react-bootstrap";
import _isEqual from "lodash/isEqual"
import "./dropdown-button.scss";

const propTypes = {
    onChange: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
    })).isRequired,
    value: PropTypes.any,
    className: PropTypes.string,
}
const DropdownButton = React.memo(({onChange, values = [], value, className}) =>{
    const content = useMemo(()=>{
        return (
            (values.length && values.map((item, index)=>(
                <Dropdown.Item
                    key={`${item.value}-${item.label}-${index}`}
                    onClick={onChange.bind(null, item.value)}>
                        {item.label}
                </Dropdown.Item>
            ))) || null
        )
    }, [values, onChange])

    return (
        <BootstrapDropdownButton
            alignRight
            className={"btn--dropdown " + className}
            title={values.find(item => _isEqual(item.value, value))?.label}>
            {content}
        </BootstrapDropdownButton>
    )
}, (prev, next) => prev.value === next.value)

DropdownButton.propTypes = propTypes;

export default DropdownButton;