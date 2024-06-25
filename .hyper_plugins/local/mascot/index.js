styles = {
    img: {
        zIndex: 20,
        position: "absolute",
        bottom: "0px",
        right: "50px",
    },
    baloon: {
        zIndex: 30,
        position: "absolute",
        bottom: "130px",
    },
};
exports.decorateConfig = (config) => {
    return Object.assign({}, config, {
        //元のconfigを保持するため
        cursorColor: "yellow",
    });
};

exports.decorateTerm = (Term, { React, notify }) => {
    return class extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.skins = {
                normal: React.createElement("img", {
                    src: "file:///Users/MacBookAir/.hyper_plugins/local/path/slime.gif",
                    // src: "file:///Users/MacBookAir/.hyper_plugins/local/path/slime-blue.png",
                    onClick: () => {},
                }),
                angry: React.createElement("img", {
                    src: "file:///Users/MacBookAir/.hyper_plugins/local/path/slime-pink.png",
                    onClick: () => {},
                }),
                worried: React.createElement("img", {
                    src: "file:///Users/MacBookAir/.hyper_plugins/local/path/slime-green.png",
                    onClick: () => {},
                }),
                trouble: React.createElement("img", {
                    src: "file:///Users/MacBookAir/.hyper_plugins/local/path/slime-orange.png",
                    onClick: () => {},
                }),
            };
        }

        render() {
            const { skin, speech } = this.props.mascotState
                ? this.props.mascotState
                : { skin: "normal", speech: "Jump,Jump!" };

            const skinComponent = this.skins[skin];
            const classNames = skin == "normal" ? "balloon" : "balloon shake";

            const children = [
                React.createElement(
                    "div",
                    { style: styles.img },
                    React.createElement(
                        "div",
                        { style: styles.baloon, class: classNames },
                        React.createElement("p", {}, speech)
                    ),
                    skinComponent
                ),
                React.createElement(Term, Object.assign({}, this.props, {})),
            ];

            return React.createElement(
                "div",
                {
                    style: {
                        width: "100%",
                        height: "100%",
                        position: "relative",
                    },
                },
                children
            );
        }
    };
};

detect_emacs = (data) => {
    return /.*Welcome to GNU Emacs,.*/.test(data);
};
detect_fileNotFound = (data) => {
    // return /.*: no such file or directory/.test(data);
    return /.* No such file or directory/.test(data);
};
detect_cmdNotFound = (data) => {
    // return /zsh: command not found: .*/.test(data);
    return /.* command not found/.test(data);
};
detect_syntaxErr = (data) => {
    return /.* syntax error near unexpected token.*/.test(data);
};

exports.middleware = (store) => (next) => (action) => {
    if (action.type === "SESSION_ADD_DATA") {
        const { data } = action;
        let result;
        let duration;
        if ((result = detect_emacs(data))) {
            store.dispatch({
                type: "CHANGE_MASCOT_FEEL",
                skin: "angry",
                speech: "ヴィムつかえやぁぁぁ”ぁ”ぁ”!!",
            });
        } else if ((result = detect_fileNotFound(data))) {
            store.dispatch({
                type: "CHANGE_MASCOT_FEEL",
                skin: "angry",
                speech: "無いよ！",
            });
            duration = 3000;
        } else if ((result = detect_cmdNotFound(data))) {
            store.dispatch({
                type: "CHANGE_MASCOT_FEEL",
                skin: "worried",
                speech: "コマンド違う？",
            });
            duration = 3000;
        } else if ((result = detect_syntaxErr(data))) {
            store.dispatch({
                type: "CHANGE_MASCOT_FEEL",
                skin: "trouble",
                speech: "文字違う",
            });
            duration = 3000;
        }
        if (result) {
            setTimeout(() => {
                store.dispatch({
                    type: "CHANGE_MASCOT_FEEL",
                    skin: "normal",
                    speech: "Jump,Jump!",
                });
            }, duration);
        }
    }
    next(action);
};

exports.reduceUI = (state, action) => {
    switch (action.type) {
        case "CHANGE_MASCOT_FEEL":
            const { skin, speech, duration } = action;
            return state.set("mascotState", { skin, speech, duration });
        default:
            return state;
    }
};

const passProps = (uid, parentProps, props) =>
    Object.assign(props, {
        mascotState: parentProps.mascotState,
    });

exports.mapTermsState = (state, map) =>
    Object.assign(map, {
        mascotState: state.ui.mascotState,
    });

exports.getTermGroupProps = passProps;
exports.getTermProps = passProps;
