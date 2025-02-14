import { Typography, Drawer, Button, Card, Divider, Space } from "antd";
import { useState, useEffect, Suspense, lazy } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { TermData } from "heliannuuthus-terminology-store";
import { isMobile, isIPad13, isTablet } from "react-device-detect";
import MDXRender from "@site/src/components/MDXRender";
import { BookFilled, EditOutlined } from "@ant-design/icons";
import { useHistory } from "@docusaurus/router";
import { PopoverAvatars, DrawerAvatars } from "@site/src/components/Avatar";
import Tooltip from "@site/src/components/Tooltip";
const { Text, Link, Title } = Typography;
import { Comment } from "@site/src/components/Typography";
import Terminology from "@site/src/components/terms/Terminology";
import TermItem from "@site/src/components/terms/TermItem";
import MDXContent from "@theme/MDXContent";
import { MDXProvider } from "@mdx-js/react";
import MDXComponents from "@theme/MDXComponents";
import { compile } from "@mdx-js/mdx";
import runtime from "react/jsx-runtime";
import React from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMDXComponents as _provideComponents } from "@mdx-js/react";
import JsxParser from "react-jsx-parser";
import Crypto from "@site/blog/terms/crypto.mdx";
declare global {
  interface Window {
    _cachedTerms: Record<string, any>;
  }
}

const useMobile = isMobile || isIPad13 || isTablet;

type TermContent = {
  title: string;
  description: string;
  content: string;
  authors: Record<string, AuthorAttributes>;
};

const TooltipsPreview = ({
  path,
  anchor,
  children,
  content,
}: {
  path: string;
  anchor: string;
  children: React.ReactNode;
  content: TermContent;
}) => {
  return (
    <Tooltip
      arrow={false}
      trigger={"click"}
      styles={{
        root: {
          maxWidth: "520px",
        },
        body: {
          padding: 0,
        },
      }}
      title={
        <Card
          style={{
            padding: 0,
          }}
          title={content.title}
          styles={{
            header: {},
            body: {
              maxHeight: "32vh",
              overflow: "auto",
            },
          }}
          bordered={false}
          actions={[
            <Tooltip
              title={`更多内容请前往 ${
                path.split("/").filter(Boolean)[2]
              } 词典`}
            >
              <Button
                type="link"
                href={`${path}${anchor}`}
                icon={<BookFilled />}
                children={`词典`}
              />
            </Tooltip>,
            <Tooltip title={`内容描述有问题？提交 PR 修改`}>
              <Button
                type="link"
                href={`https://github.com/heliannuuthus/heliannuuthus.github.io/edit/master${path}.mdx`}
                icon={<EditOutlined key="edit" />}
                children={`编辑`}
              />
            </Tooltip>,
          ]}
        >
          <Title level={1} children={content.title} />
          <Typography.Paragraph
            style={{ marginBottom: 16, display: "flex", alignItems: "center" }}
          >
            <PopoverAvatars authors={content.authors} />
            <Text> 贡献</Text>
          </Typography.Paragraph>

          {content.content}
        </Card>
      }
      children={
        <Link
          style={{
            textDecoration: "underline dashed",
            textUnderlineOffset: "4px",
          }}
          children={children}
        />
      }
    />
  );
};

const DrawerPreview = ({
  path,
  anchor,
  children,
  content,
}: {
  path: string;
  anchor: string;
  children: React.ReactNode;
  content: TermContent;
}) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  return (
    <>
      <Link
        style={{
          textDecoration: "underline dashed",
          textUnderlineOffset: "4px",
        }}
        href={`${path}${anchor}`}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        children={children}
      />
      <Drawer
        placement="bottom"
        title={content.title}
        open={open}
        onClose={() => setOpen(false)}
        closable={false}
        footer={
          <Space
            style={{ width: "100%", justifyContent: "space-around" }}
            align="center"
            split={<Divider type="vertical" />}
          >
            <Button
              href={`${path}${anchor}`}
              type="link"
              icon={<BookFilled />}
              target="_blank"
              children={`词典`}
            />
            <Button
              type="link"
              href={`https://github.com/heliannuuthus/heliannuuthus.github.io/edit/master${path}.mdx`}
              target="_blank"
              icon={<EditOutlined key="edit" />}
              children={`编辑`}
            />
          </Space>
        }
      >
        <Typography.Paragraph
          style={{
            marginBottom: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <DrawerAvatars authors={content.authors} />
          <Text> 贡献</Text>
        </Typography.Paragraph>
        <MDXRender
          content={content.content}
          components={() => ({
            Term: TermPreview,
            Comment: Comment,
            Tooltip: Tooltip,
          })}
        />
      </Drawer>
    </>
  );
};

const TermPreview = ({
  children,
  path,
  anchor,
}: {
  children: React.ReactNode;
  path: string;
  anchor: string;
}) => {
  const [content, setContent] = useState<TermContent | null>(null);
  const { withBaseUrl } = useBaseUrlUtils();
  const { authors } = usePluginData("authors-docusaurus-plugin") as {
    authors: Record<string, AuthorAttributes>;
  };

  const fetchContent = async (
    url: string,
    authors: Record<string, AuthorAttributes>
  ) => {
    try {
      // 如果缓存存在且有数据，直接使用缓存
      if (
        typeof window !== "undefined" &&
        window._cachedTerms?.[`${url}-${anchor}`]
      ) {
        setContent({
          title: window._cachedTerms[`${url}-${anchor}`].metadata.title,
          description:
            window._cachedTerms[`${url}-${anchor}`].metadata.description,
          authors: window._cachedTerms[`${url}-${anchor}`].metadata.authors,
          content: window._cachedTerms[`${url}-${anchor}`].content,
        });
        return;
      }
      // 否则从服务器获取
      anchor = anchor.substring(1);
      const response = await fetch(withBaseUrl(`${path}.json`));
      const data = await response.json();
      console.log(
        "data",
        <MDXRender
          content={data}
          components={() => ({
            Term: TermPreview,
            TermPreview: TermPreview,
            Terminology: Terminology,
            TermItem: TermItem,
            Comment: Comment,
            Tooltip: Tooltip,
          })}
        />
      );
      const term = data[anchor];
      // 更新状态和缓存
      setContent({
        title: term.metadata.title,
        description: term.metadata.description,
        authors: term.metadata.authors.reduce(
          (acc: Record<string, AuthorAttributes>, author: string) => {
            acc[author] = authors[author];
            return acc;
          },
          {} as Record<string, AuthorAttributes>
        ),
        content: (
          <MDXRender
            content={data}
            components={() => ({
              Term: TermPreview,
              TermPreview: TermPreview,
              Terminology: Terminology,
              TermItem: TermItem,
              Comment: Comment,
              Tooltip: Tooltip,
            })}
          />
        ),
      });
      if (typeof window !== "undefined") {
        window._cachedTerms = window._cachedTerms || {};
        window._cachedTerms[`${url}-${anchor}`] = term;
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  };

  useEffect(() => {
    fetchContent(`${path.replace(/\/$/, "")}.json`, authors);
  }, [path, anchor]);

  return (
    <BrowserOnly
      fallback={
        <Tooltip title={<div>网络好像出现了一些问题...</div>}>
          {children}
        </Tooltip>
      }
    >
      {() =>
        content ? (
          useMobile ? (
            <DrawerPreview
              path={path}
              anchor={anchor}
              content={content}
              children={children}
            />
          ) : (
            <TooltipsPreview
              path={path}
              anchor={anchor}
              content={content}
              children={children}
            />
          )
        ) : (
          "loading..."
        )
      }
    </BrowserOnly>
  );
};

export const TerminologyPreview = ({
  path,
  anchor,
  children,
}: {
  path: string;
  anchor: string;
  children: React.ReactNode;
}) => {
  const [Component, setComponent] = useState(() => () => null);

  const { withBaseUrl } = useBaseUrlUtils();
  const { authors } = usePluginData("authors-docusaurus-plugin") as {
    authors: Record<string, AuthorAttributes>;
  };

  const fetchContent = async (
    url: string,
    authors: Record<string, AuthorAttributes>
  ) => {
    await import(`@site/blog/terms/${path.split("/").pop()}.mdx`).then(
      (exported) => {
        setComponent(() => exported.default);
        console.log("content1", exported);
      }
    );
  };
  useEffect(() => {
    fetchContent(`${path.replace(/\/$/, "")}.json`, authors);
  }, [path, anchor]);

  return (
    <Suspense fallback={<div>loading...</div>}>
    </Suspense>
  );
};

export default TermPreview;
