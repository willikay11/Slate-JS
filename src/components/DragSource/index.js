import React from "react";
import { Row, Col, Button} from "antd";
import Signature from "./components/Signature";
import Text from "./components/Text";

const dragSourceContainer = (props) => (
    <Row>
        <Col span={12}>
            <Signature />
        </Col>

        <Col span={12}>
            <Text />
        </Col>

        <Col span={24}>
            <Button type="primary" onClick={props.onOpen}>Submit</Button>
        </Col>
    </Row>
);

export default dragSourceContainer;