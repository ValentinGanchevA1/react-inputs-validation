import * as React from "react";
const { useState, useEffect, useCallback, useRef, memo } = React;
import message from "./message";
import {
  REACT_INPUTS_VALIDATION_CUSTOM_ERROR_MESSAGE_EXAMPLE,
  DEFAULT_LOCALE,
  WRAPPER_CLASS_IDENTITIFIER,
  OPTION_LIST_ITEM_IDENTITIFIER,
  MSG_CLASS_IDENTITIFIER,
  usePrevious,
} from "./const";
import utils from "./utils";
import reactInputsValidationCss from "./react-inputs-validation.css";
const TYPE = "radiobox";
interface DefaultValidationOption {
  name?: string;
  check?: boolean;
  showMsg?: boolean;
  required?: boolean;
  locale?: string;
  msgOnError?: string;
  msgOnSuccess?: string;
}
const getDefaultValidationOption = (obj: DefaultValidationOption) => {
  let {
    name,
    check,
    required,
    showMsg,
    locale,
    msgOnError,
    msgOnSuccess,
  } = obj;
  locale = typeof locale !== "undefined" ? locale : DEFAULT_LOCALE;
  name = typeof name !== "undefined" ? name : "";
  check = typeof check !== "undefined" ? check : true;
  showMsg = typeof showMsg !== "undefined" ? showMsg : true;
  required = typeof required !== "undefined" ? required : true;
  msgOnSuccess = typeof msgOnSuccess !== "undefined" ? msgOnSuccess : "";
  msgOnError = typeof msgOnError !== "undefined" ? msgOnError : "";
  return {
    name,
    check,
    showMsg,
    required,
    locale,
    msgOnError,
    msgOnSuccess,
  };
};
interface DefaultAsyncMsgObj {
  error?: boolean;
  message?: string;
  showOnError?: boolean;
  showOnSuccess?: boolean;
}
const getDefaultAsyncObj = (obj: DefaultAsyncMsgObj) => {
  let { error, message, showOnError, showOnSuccess } = obj;
  error = typeof error !== "undefined" ? error : false;
  message = typeof message !== "undefined" ? message : "";
  showOnError = typeof showOnError !== "undefined" ? showOnError : true;
  showOnSuccess = typeof showOnSuccess !== "undefined" ? showOnSuccess : false;
  return {
    error,
    message,
    showOnError,
    showOnSuccess,
  };
};
export const isValidValue = (list: OptionListItem[], value: any) => {
  let res = false;
  if (list.length) {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].id === value) {
        res = true;
        break;
      }
    }
  }
  return res;
};
interface OptionListItem {
  id: string;
  name: string;
}
interface AttributesInput {
  id?: string;
  name?: string;
}
interface Props {
  attributesWrapper: React.HTMLAttributes<HTMLDivElement>;
  attributesInputs: AttributesInput;
  value?: string | number;
  disabled?: boolean;
  validate?: boolean;
  optionList?: OptionListItem[];
  onChange: (res: string, e: React.ChangeEvent<HTMLElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  validationOption?: DefaultValidationOption;
  asyncMsgObj?: DefaultAsyncMsgObj;
  classNameWrapper?: string;
  classNameInput?: string;
  classNameContainer?: string;
  classNameOptionListItem?: string;
  customStyleWrapper?: React.CSSProperties;
  customStyleContainer?: React.CSSProperties;
  customStyleInput?: React.CSSProperties;
  customStyleOptionListItem?: React.CSSProperties;
  validationCallback?: (res: boolean) => void;
}
const component: React.FC<Props> = ({
  attributesWrapper = {},
  attributesInputs = [],
  value = "",
  disabled = false,
  validate = false,
  optionList = [],
  classNameWrapper = "",
  classNameInput = "",
  classNameContainer = "",
  classNameOptionListItem = "",
  customStyleWrapper = {},
  customStyleContainer = {},
  customStyleInput = {},
  customStyleOptionListItem = {},
  validationOption = {},
  asyncMsgObj = {},
  onChange = () => {},
  onBlur = null,
  onFocus = null,
  onClick = null,
  validationCallback = null,
}) => {
  const [err, setErr] = useState(false);
  const [msg, setMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [internalValue, setInternalValue] = useState(String(value));
  const prevInternalValue = usePrevious(internalValue);
  const option = getDefaultValidationOption(validationOption);
  const asyncObj = getDefaultAsyncObj(asyncMsgObj);
  const $input = useRef(null);
  const $el: { [key: string]: any } | null = $input;
  const handleOnBlur = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      if (onBlur && !disabled) {
        check();
        onBlur(e);
      }
    },
    [internalValue, option, disabled]
  );
  const handleOnFocus = useCallback((e: React.FocusEvent<HTMLElement>) => {
    if (onFocus) {
      onFocus(e);
    }
  }, []);
  const handleOnClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick(e);
    }
  }, []);
  const handleOnChange = useCallback(
    (val: string, e: React.ChangeEvent<HTMLElement>) => {
      if (disabled || $el === null) {
        return;
      }
      setInternalValue(val);
      onChange && onChange(val, e);
    },
    [disabled]
  );
  const check = useCallback(() => {
    const { name, check, locale, required, msgOnSuccess } = option;
    if (!check) {
      return;
    }
    if (!message[locale] || !message[locale][TYPE]) {
      console.error(REACT_INPUTS_VALIDATION_CUSTOM_ERROR_MESSAGE_EXAMPLE);
      return;
    }
    if (required) {
      const msg = message[locale][TYPE];
      const nameText = name ? name : "";
      if (!isValidValue(optionList, internalValue)) {
        handleCheckEnd(true, msg.empty(nameText));
        return;
      }
    }
    if (msgOnSuccess) {
      setSuccessMsg(msgOnSuccess);
    }
    handleCheckEnd(false, msgOnSuccess);
  }, [internalValue, option]);
  const handleCheckEnd = useCallback(
    (err: boolean, message: string) => {
      let msg = message;
      const { msgOnError } = option;
      if (err && msgOnError) {
        msg = msgOnError;
      }
      setErr(err);
      setMsg(msg);
      validationCallback && validationCallback(err);
    },
    [option.msgOnError]
  );
  useEffect(() => {
    if (validate) {
      check();
    }
  }, [validate]);
  useEffect(() => {
    if (internalValue && isValidValue(optionList, internalValue)) {
      setErr(false);
    } else {
      setSuccessMsg("");
    }
  }, [internalValue]);
  useEffect(() => {
    setInternalValue(String(value));
  }, [value]);
  useEffect(() => {
    if (
      typeof prevInternalValue !== "undefined" &&
      prevInternalValue !== internalValue
    ) {
      check();
    }
  }, [prevInternalValue, internalValue]);
  useEffect(() => {
    if (asyncObj) {
      if (asyncObj.message) {
        if (asyncObj.showOnError) {
          handleCheckEnd(asyncObj.error, asyncObj.message);
        }
        if (!asyncObj.error && asyncObj.showOnSuccess) {
          setSuccessMsg(asyncObj.message);
        }
      }
    }
  }, [asyncMsgObj]);
  const wrapperClass = `${WRAPPER_CLASS_IDENTITIFIER} ${classNameWrapper} ${
    err && reactInputsValidationCss["error"]
  } ${successMsg !== "" && !err && reactInputsValidationCss["success"]} ${
    reactInputsValidationCss[`${TYPE}__wrapper`]
  } ${disabled && reactInputsValidationCss["disabled"]}`;
  const containerClass = `${classNameContainer} ${
    err && reactInputsValidationCss["error"]
  } ${successMsg !== "" && !err && reactInputsValidationCss["success"]} ${
    reactInputsValidationCss[`${TYPE}__container`]
  } ${disabled && reactInputsValidationCss["disabled"]}`;
  const inputClass = `${classNameInput} ${
    err && reactInputsValidationCss["error"]
  } ${successMsg !== "" && !err && reactInputsValidationCss["success"]} ${
    reactInputsValidationCss[`${TYPE}__input`]
  } ${disabled && reactInputsValidationCss["disabled"]}`;
  const labelClass = `${err && reactInputsValidationCss["error"]} ${
    successMsg !== "" && !err && reactInputsValidationCss["success"]
  } ${reactInputsValidationCss[`${TYPE}__label`]} ${
    disabled && reactInputsValidationCss["disabled"]
  }`;
  const optionListItemClass = `${
    reactInputsValidationCss["button"]
  } ${OPTION_LIST_ITEM_IDENTITIFIER} ${classNameOptionListItem} ${
    err && reactInputsValidationCss["error"]
  } ${successMsg !== "" && !err && reactInputsValidationCss["success"]} ${
    reactInputsValidationCss[`${TYPE}__item`]
  } ${disabled && reactInputsValidationCss["disabled"]}`;
  const errMsgClass = `${MSG_CLASS_IDENTITIFIER} ${
    reactInputsValidationCss["msg"]
  } ${err && reactInputsValidationCss["error"]}`;
  const successMsgClass = `${MSG_CLASS_IDENTITIFIER} ${
    reactInputsValidationCss["msg"]
  } ${!err && reactInputsValidationCss["success"]}`;
  let msgHtml;
  const { showMsg } = option;
  if (showMsg && err && msg) {
    msgHtml = <div className={errMsgClass}>{msg}</div>;
  }
  if (showMsg && !err && successMsg !== "") {
    msgHtml = <div className={successMsgClass}>{successMsg}</div>;
  }
  let optionHtml;
  if (optionList.length) {
    optionHtml = optionList.map((i, k) => {
      const checked = String(i.id) === String(internalValue) ? true : false;
      return (
        <Option
          key={k}
          checked={checked}
          id={`react-inputs-validation__radiobox_option-${i.id}`}
          item={i}
          inputClass={inputClass}
          value={internalValue}
          disabled={disabled}
          optionListItemClass={optionListItemClass}
          customStyleOptionListItem={customStyleOptionListItem}
          customStyleInput={customStyleInput}
          labelClass={labelClass}
          onChange={handleOnChange}
          attributesInput={attributesInputs[k] ? attributesInputs[k] : {}}
        />
      );
    });
  }
  return (
    <div
      ref={$input}
      className={wrapperClass}
      style={customStyleWrapper}
      onClick={handleOnClick}
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      {...attributesWrapper}
    >
      <div className={containerClass} style={customStyleContainer}>
        {optionHtml}
      </div>
      {msgHtml}
    </div>
  );
};
interface OptionProps {
  checked?: boolean;
  id?: string;
  optionListItemClass?: string;
  labelClass?: string;
  inputClass?: string;
  value?: string | number;
  disabled?: boolean;
  item?: OptionListItem;
  customStyleOptionListItem?: object;
  customStyleInput?: object;
  attributesInput: AttributesInput;
  onChange?: (res: string, e: React.ChangeEvent<HTMLElement>) => void;
}
export const Option: React.FC<OptionProps> = memo(
  ({
    checked = false,
    id = "",
    optionListItemClass = "",
    labelClass = "",
    inputClass = "",
    value = "",
    disabled = false,
    item = { id: "", name: "" },
    customStyleOptionListItem = {},
    customStyleInput = {},
    attributesInput = {},
    onChange = () => {},
  }) => {
    const handleOnChange = useCallback(
      (e) => {
        onChange(item.id, e);
      },
      [item, disabled]
    );
    return (
      <button
        type="button"
        className={optionListItemClass}
        style={customStyleOptionListItem}
        onClick={handleOnChange}
      >
        <input
          id={id}
          type="radio"
          value={value}
          checked={checked}
          disabled={disabled}
          className={
            checked
              ? `${reactInputsValidationCss["checked"]} ${inputClass}`
              : `${inputClass}`
          }
          onChange={handleOnChange}
          style={customStyleInput}
          {...attributesInput}
        />
        <label
          htmlFor={attributesInput.id ? attributesInput.id : id}
          className={
            checked
              ? `${reactInputsValidationCss["checked"]} ${labelClass}`
              : `${labelClass}`
          }
        >
          {item.name}
        </label>
      </button>
    );
  }
);
export default memo(component);
