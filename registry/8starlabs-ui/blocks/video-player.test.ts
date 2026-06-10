import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import VideoRoot, {
  formatVideoTime,
  getNextSeekTime,
  isVideoSeekKey,
  VideoControls,
  VideoPlayTrigger,
  VideoProgressBar,
  VideoViewport
} from "./video-player";

describe("formatVideoTime", () => {
  it("formats invalid and negative media times as zero", () => {
    assert.equal(formatVideoTime(Number.NaN), "0:00");
    assert.equal(formatVideoTime(Number.POSITIVE_INFINITY), "0:00");
    assert.equal(formatVideoTime(-12), "0:00");
  });

  it("formats sub-hour media times as minutes and seconds", () => {
    assert.equal(formatVideoTime(0), "0:00");
    assert.equal(formatVideoTime(65.9), "1:05");
    assert.equal(formatVideoTime(599), "9:59");
  });

  it("formats long media times with an hour segment", () => {
    assert.equal(formatVideoTime(3600), "1:00:00");
    assert.equal(formatVideoTime(3661.8), "1:01:01");
    assert.equal(formatVideoTime(7325), "2:02:05");
  });
});

describe("getNextSeekTime", () => {
  it("clamps keyboard seeking inside the available duration", () => {
    assert.equal(getNextSeekTime(3, 120, "ArrowLeft"), 0);
    assert.equal(getNextSeekTime(118, 120, "ArrowRight"), 120);
    assert.equal(getNextSeekTime(113, 120, "ArrowRight", true), 120);
  });

  it("supports Home and End shortcuts", () => {
    assert.equal(getNextSeekTime(42, 120, "Home"), 0);
    assert.equal(getNextSeekTime(42, 120, "End"), 120);
  });

  it("keeps the current time for unsupported keys or unknown durations", () => {
    assert.equal(getNextSeekTime(42, 120, "Space"), 42);
    assert.equal(getNextSeekTime(42, 0, "ArrowRight"), 42);
    assert.equal(getNextSeekTime(42, Number.NaN, "End"), 42);
  });
});

describe("isVideoSeekKey", () => {
  it("identifies keyboard shortcuts owned by the seek slider", () => {
    assert.equal(isVideoSeekKey("ArrowLeft"), true);
    assert.equal(isVideoSeekKey("ArrowRight"), true);
    assert.equal(isVideoSeekKey("Home"), true);
    assert.equal(isVideoSeekKey("End"), true);
    assert.equal(isVideoSeekKey("Space"), false);
  });
});

describe("VideoRoot", () => {
  function renderBasicPlayer() {
    return React.createElement(
      VideoRoot,
      null,
      React.createElement(VideoViewport, {
        src: "https://vjs.zencdn.net/v/oceans.mp4"
      }),
      React.createElement(
        VideoControls,
        null,
        React.createElement(VideoPlayTrigger),
        React.createElement(VideoProgressBar)
      )
    );
  }

  it("renders custom controls visible before the first pointer movement", () => {
    const markup = renderToStaticMarkup(renderBasicPlayer());

    assert.match(markup, /data-slot="video-controls"/);
    assert.match(markup, /opacity-100/);
    assert.doesNotMatch(markup, /opacity-0 pointer-events-none/);
  });

  it("does not emit duplicate hard-coded ids when multiple players render", () => {
    const markup = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        renderBasicPlayer(),
        renderBasicPlayer()
      )
    );

    assert.doesNotMatch(markup, /\sid="/);
  });
});
