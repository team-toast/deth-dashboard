import styled, { keyframes } from "styled-components";
import { Row, Col } from "./../styles/flex-grid";

export default function Media() {
  return (
    <GridContainer>
      <h2 className="text-center">Media</h2>
      <Row xsNoflex smNoflex className="twitter-feed">
        <Col className="max-height" size={1}>
          <ArticleImage></ArticleImage>
          <div className="article-body">
            <h3>(Eth is Money)² = dEth</h3>
            <p>
              It has become a proud tradition within DeFi for us to redo 50
              years of derivatives innovation and claim it as new art. In our
              defence we do often come up with these ideas independently of
              actually having studied traditional finance. I continue that proud
              tradition here ;-)
            </p>
            <a
              href="https://schalk-dormehl.medium.com/eth-is-money-%C2%B2-deth-13320315cfb6"
              target="_blank"
              rel="noreferrer"
            >
              Read Article
            </a>
          </div>
        </Col>
        <Col className="max-height twitter-feed-col" size={1}>
          <a
            className="twitter-timeline"
            href="https://twitter.com/FoundryDAO?ref_src=twsrc%5Etfw"
          >
            Tweets by FoundryDAO
          </a>{" "}
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charSet="utf-8"
          ></script>{" "}
        </Col>
      </Row>
    </GridContainer>
  );
}

const ArticleImage = styled.div`
  background: url(/5053309.jpeg) center center / cover no-repeat rgb(26, 28, 42);
  min-height: 14em;
  padding: 0px 3.56em;
  position: relative;
  &:after {
    content: " ";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: url(/FOUNDRY-LOGO-transparent.png) center center / contain
      no-repeat;
  }
`;

const GridContainer = styled.div`
  max-width: 77.5em;
  margin: auto;
  width: 100%;
  h2 {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .max-height {
    max-height: 480px;
    overflow-y: auto;
    margin: 1rem;
    box-shadow: 0px 3px 20px #0000001a;
    border-radius: 5px;
    @media screen and (max-width: 64em) {
      max-height: initial;
      &.twitter-feed-col {
        max-height: 480px;
      }
    }
  }
  .article-body {
    padding: 0 1rem 1rem;
  }
  h3 {
    margin-top: 1rem;
  }
`;
