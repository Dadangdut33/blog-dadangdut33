import React, { Component } from "react";

import { Tooltip } from "ak-tooltip";
import Button from "ak-button";
import CopyToClipboard from "react-copy-to-clipboard";

export default class CopyButton extends Component {
	constructor() {
		super();
		this.state = {
			toolTip: false,
		};

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.toggleToolTip(true);

		clearTimeout(this.toggleTimeout);
		this.toggleTimeout = setTimeout(() => {
			this.toggleToolTip(false);
		}, 3000);
	}

	toggleToolTip(enabled) {
		this.setState({
			toolTip: enabled,
		});
	}

	render() {
		return (
			<Tooltip description='Copied!' visible={this.state.toolTip}>
				<CopyToClipboard text={this.props.valueToCopy}>
					<div style={{ position: "absolute", right: "10px", top: "10px" }}>
						<Button appearance='default' theme={this.props.buttonTheme} onClick={this.onClick}>
							<i className='fa fa-clipboard' aria-hidden='true' /> Copy to clipboard
						</Button>
					</div>
				</CopyToClipboard>
			</Tooltip>
		);
	}
}
