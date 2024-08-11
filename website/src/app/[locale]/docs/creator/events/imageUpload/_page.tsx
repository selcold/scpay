import React from "react";
import DocsImage from "../../../_components/image";
import DocsLink from "../../../_components/link";

function Steps({
  step,
  title,
  description,
  image,
}: {
  step: number;
  title: React.ReactNode | string;
  description: React.ReactNode | string;
  image?: React.ReactNode | string;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between flex-wrap">
      <div className="md:w-1/2 md:pr-5">
        <h2>
          {step}. {title}
        </h2>
        <p>{description}</p>
      </div>
      <div className="md:w-1/2">
        {typeof image === "string" ? (
          <DocsImage
            src={image}
            alt={`Step-${step}`}
            width={450}
            height={360}
          />
        ) : (
          image
        )}
      </div>
    </div>
  );
}

function PageClient() {
  return (
    <>
      <h1>イベント画像をアップロードして設定をする</h1>
      <p>
        イベントのイメージ画像を外部サービスを使って、アップロードして、その画像をイベント画像として設定をする。
      </p>

      <section className="flex flex-col gap-5 w-full my-10">
        <Steps
          step={1}
          title="画像をアップロード"
          description={
            <>
              はじめに、
              <DocsLink href="https://imgur.com/upload" target="_blank">
                このサイト
              </DocsLink>
              で画像をアップロードします。アカウントでログインする必要はなく、ログインしていない状態でも画像を問題なくアップロードすることができます。
            </>
          }
          image={
            <DocsImage
              src="https://i.imgur.com/G8WeG0Y.png"
              alt={`Step-1`}
              width={250}
              height={160}
            />
          }
        />
        <Steps
          step={2}
          title="シェアオプションから画像IDを取得"
          description="シェアオプションを開いて画像のIDを取得してください。この画像IDはアップロードした後にリダイレクトされたURLと異なるため注意してください。"
          image={
            <DocsImage
              src="https://i.imgur.com/5nznDx5.png"
              alt={`Step-1`}
              width={250}
              height={160}
            />
          }
        />
        <Steps
          step={3}
          title="シェアオプション"
          description="
          シェアURLと、画像元のURLが違うので、一番上の `Share Link`
          のURLの後ろに `.png`
          を追加したURLにアクセスしてください。アクセスすると画像元のURLにリダイレクトされます。そのURLのドメインは
          `i.imgur.com` となっており、`https://i.imgur.com/<ID>.png` で構成されています。
          "
          image={
            <DocsImage
              src="https://i.imgur.com/Eefdjym.png"
              alt={`Step-1`}
              width={250}
              height={160}
            />
          }
        />
      </section>
    </>
  );
}

export default PageClient;
