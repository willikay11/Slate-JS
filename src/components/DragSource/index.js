import React from "react";
import { Row, Col} from "antd";
import Signature from "./components/Signature";
import Text from "./components/Text";

const dragSourceContainer = () => (
    <Row style={{ flex: 'row', display: 'flex' }}>
        <Col span={12}>
            <Signature />
        </Col>

        <Col span={12}>
            <Text />
        </Col>

    </Row>
);

export default dragSourceContainer;