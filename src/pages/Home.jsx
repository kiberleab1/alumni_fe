import { useQuery } from 'react-query';
import { getUsers } from '../api';

// function Home() {
//   const { isError, data, error, isFetching } = useQuery('posts', async () => {
//     return await getUsers({ pageNumber: 0, pageSize: 10 });
//   });
//   console.log(data);
//   if (isFetching) return <div>Loading...</div>;
//   if (isError) return <div>Error: {error.message}</div>;
//   return <div className="bg-white">Hello World</div>;
// }
// export default Home;

export default function Home() {
  const { isError, data, error, isFetching } = useQuery('posts', async () => {
    return await getUsers({ pageNumber: 0, pageSize: 10 });
  });
  console.log(data);
  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <div className="home page-template-default page page-id-2146 siteorigin-panels siteorigin-panels-before-js siteorigin-panels-home">
        <div id="page" className="site main-wrapper">
          <div className="header-wrapper">
            <header id="header" className="container-header type1">
              <div className="top-nav">
                <div className="container">
                  <div className="row">
                    <div className="top-left col-sm-6 hidden-xs">
                      <ul className="list-inline list-inline-top"></ul>
                    </div>
                    <div className="top-right col-sm-6 col-xs-12">
                      <ul className="list-inline">
                        <li className="top-search">
                          <form
                            className="navbar-form search no-margin no-padding"
                            action="index.html%3Fp=2030.html"
                          >
                            <input
                              type="text"
                              name="s"
                              className="form-control input-search"
                              placeholder="search..."
                              // autocomplete="off"
                            />
                            <button
                              type="submit"
                              className="lnr lnr-magnifier"
                            ></button>
                          </form>
                        </li>
                        <li className="login">
                          <a href="account/index.html" title="Login">
                            Login
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="header-middle">
                <div className="container">
                  <div className="logo hidden-sm hidden-xs">
                    <a
                      href="index.html%3Fp=2030.html"
                      title="Sayidan"
                      rel="home"
                    >
                      <img
                        src="wp-content/themes/sayidan/images/logo.png"
                        alt="Sayidan"
                      />
                    </a>
                  </div>

                  <div className="area-desktop-content menu">
                    <nav>
                      <ul className="nav navbar-nav sf-menu">
                        <li
                          id="menu-item-2177"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2177"
                        >
                          <a href="index.html%3Fp=2105.html">About us</a>
                          <ul className="sub-menu">
                            <li
                              id="menu-item-2173"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2173"
                            >
                              <a href="index.html%3Fp=2138.html">Contact</a>
                            </li>
                            <li
                              id="menu-item-2174"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2174"
                            >
                              <a href="student-directory/page/1/index.html">
                                Directory
                              </a>
                            </li>
                            <li
                              id="menu-item-2175"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2175"
                            >
                              <a href="university-gallery/page/1/index.html">
                                Gallery
                              </a>
                            </li>
                            <li
                              id="menu-item-2176"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2176"
                            >
                              <a href="news-builder/page/1/index.html">News</a>
                            </li>
                            <li
                              id="menu-item-1857"
                              className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1857"
                            >
                              <a href="index.html%3Fp=1178.html">Typography</a>
                            </li>
                          </ul>
                        </li>
                        <li
                          id="menu-item-2180"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2180"
                        >
                          <a href="index.html%3Fp=2159.html">
                            Program &#038; Events
                          </a>
                          <ul className="sub-menu">
                            <li
                              id="menu-item-1845"
                              className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1845"
                            >
                              <a href="index.html%3Fp=226.html">Sponsorship</a>
                            </li>
                            <li
                              id="menu-item-2056"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2056"
                            >
                              <a href="index.html%3Fp=2020.html">
                                Latest Members
                              </a>
                            </li>
                            <li
                              id="menu-item-2060"
                              className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2060"
                            >
                              <a href="member-profile/alinaradionova/index.html">
                                Alumni Profile
                              </a>
                            </li>
                            <li
                              id="menu-item-2059"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2059"
                            >
                              <a href="index.html%3Fp=2016.html">
                                Alumni Login
                              </a>
                            </li>
                            <li
                              id="menu-item-2058"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2058"
                            >
                              <a href="index.html%3Fp=2018.html">
                                Alumni Register
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li
                          id="menu-item-2179"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2179"
                        >
                          <a href="index.html%3Fp=2116.html">Alumni Stories</a>
                          <ul className="sub-menu">
                            <li
                              id="menu-item-2066"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2066"
                            >
                              <a href="index.html%3Fp=2064.html">
                                Restricted Materials
                              </a>
                            </li>
                            <li
                              id="menu-item-1955"
                              className="menu-item menu-item-type-post_type menu-item-object-story menu-item-1955"
                            >
                              <a href="index.html%3Fp=551.html">
                                World Level Mentors
                              </a>
                            </li>
                            <li
                              id="menu-item-2061"
                              className="menu-item menu-item-type-post_type menu-item-object-post menu-item-2061"
                            >
                              <a href="index.html%3Fp=1177.html">
                                Image Alignment
                              </a>
                            </li>
                            <li
                              id="menu-item-2063"
                              className="menu-item menu-item-type-post_type menu-item-object-post menu-item-2063"
                            >
                              <a href="index.html%3Fp=1174.html">
                                Special Characters
                              </a>
                            </li>
                            <li
                              id="menu-item-2062"
                              className="menu-item menu-item-type-post_type menu-item-object-post menu-item-2062"
                            >
                              <a href="index.html%3Fp=1176.html">
                                Text Alignment
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li
                          id="menu-item-2181"
                          className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2181"
                        >
                          <a href="career-opportunity/page/1/index.html">
                            Career Opportunity
                          </a>
                          <ul className="sub-menu">
                            <li
                              id="menu-item-2182"
                              className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2182"
                            >
                              <a href="index.html%3Fp=2129.html">
                                Apply to Job
                              </a>
                            </li>
                            <li
                              id="menu-item-653"
                              className="menu-item menu-item-type-custom menu-item-object-custom menu-item-653"
                            >
                              <a href="index.html%3Fp=155.html">
                                Apply to Boeing
                              </a>
                            </li>
                            <li
                              id="menu-item-654"
                              className="menu-item menu-item-type-custom menu-item-object-custom menu-item-654"
                            >
                              <a href="index.html%3Fp=106.html">
                                Google Developers
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div className="area-mobile-content visible-sm visible-xs">
                    <div className="header-container">
                      <div className="row">
                        <div className="logo-mobile ol-md-8">
                          <a
                            href="index.html%3Fp=2030.html"
                            title="Sayidan"
                            rel="home"
                          >
                            <img
                              src="wp-content/themes/sayidan/images/logo-small.png"
                              alt="Sayidan"
                            />
                          </a>
                        </div>

                        <div className="col-md-4">
                          <button
                            type="button"
                            className="navbar-toggle collapsed"
                            data-toggle="collapse"
                            data-target="#navbar-mobile"
                          >
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mobile-navigation">
                      <div className="container">
                        <nav id="site-navigation-mobile">
                          <div
                            id="navbar-mobile"
                            className="navbar-collapse collapse"
                          >
                            <ul
                              id="menu-main-menu-1"
                              className="nav navbar-mob"
                            >
                              <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2177">
                                <a href="index.html%3Fp=2105.html">About us</a>
                                <ul className="sub-menu">
                                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2173">
                                    <a href="index.html%3Fp=2138.html">
                                      Contact
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2174">
                                    <a href="student-directory/page/1/index.html">
                                      Directory
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2175">
                                    <a href="university-gallery/page/1/index.html">
                                      Gallery
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2176">
                                    <a href="news-builder/page/1/index.html">
                                      News
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1857">
                                    <a href="index.html%3Fp=1178.html">
                                      Typography
                                    </a>
                                  </li>
                                </ul>
                              </li>
                              <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2180">
                                <a href="index.html%3Fp=2159.html">
                                  Program &#038; Events
                                </a>
                                <ul className="sub-menu">
                                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-1845">
                                    <a href="index.html%3Fp=226.html">
                                      Sponsorship
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2056">
                                    <a href="index.html%3Fp=2020.html">
                                      Latest Members
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-2060">
                                    <a href="member-profile/alinaradionova/index.html">
                                      Alumni Profile
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2059">
                                    <a href="index.html%3Fp=2016.html">
                                      Alumni Login
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2058">
                                    <a href="index.html%3Fp=2018.html">
                                      Alumni Register
                                    </a>
                                  </li>
                                </ul>
                              </li>
                              <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2179">
                                <a href="index.html%3Fp=2116.html">
                                  Alumni Stories
                                </a>
                                <ul className="sub-menu">
                                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2066">
                                    <a href="index.html%3Fp=2064.html">
                                      Restricted Materials
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-story menu-item-1955">
                                    <a href="index.html%3Fp=551.html">
                                      World Level Mentors
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-post menu-item-2061">
                                    <a href="index.html%3Fp=1177.html">
                                      Image Alignment
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-post menu-item-2063">
                                    <a href="index.html%3Fp=1174.html">
                                      Special Characters
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-post_type menu-item-object-post menu-item-2062">
                                    <a href="index.html%3Fp=1176.html">
                                      Text Alignment
                                    </a>
                                  </li>
                                </ul>
                              </li>
                              <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2181">
                                <a href="career-opportunity/page/1/index.html">
                                  Career Opportunity
                                </a>
                                <ul className="sub-menu">
                                  <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-2182">
                                    <a href="index.html%3Fp=2129.html">
                                      Apply to Job
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-653">
                                    <a href="index.html%3Fp=155.html">
                                      Apply to Boeing
                                    </a>
                                  </li>
                                  <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-654">
                                    <a href="index.html%3Fp=106.html">
                                      Google Developers
                                    </a>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </div>
                        </nav>
                      </div>
                    </div>

                    <div className="mobile-menu "></div>
                  </div>
                </div>
              </div>
            </header>
          </div>

          <div
            id="content"
            className="site-content content-wrapper page-content"
          >
            <article
              id="post-2146"
              className="post-2146 page type-page status-publish hentry"
            >
              <div className="entry-content">
                <div className="page-content-body">
                  <div id="pl-2146" className="panel-layout">
                    <div id="pg-2146-0" className="panel-grid panel-no-style">
                      <div
                        id="pgc-2146-0-0"
                        className="panel-grid-cell"
                        data-weight="1"
                      >
                        <div
                          id="panel-2146-0-0-0"
                          className="so-panel widget_sayidan_slider_widget panel-first-child"
                          data-index="0"
                          data-style='{"background_image_attachment":false,"background_display":"tile"}'
                        >
                          <div className="so-widget-sayidan_slider_widget so-widget-sayidan_slider_widget-default-d75171398898">
                            {/* <!--begin slider--> */}
                            <div className="slider-hero">
                              <div
                                className="sliders-wrap columns1"
                                data-autoplay="1"
                                data-loop=""
                                data-autoplaytimeout="500"
                              >
                                <div className="item">
                                  <img
                                    decoding="async"
                                    src="wp-content/uploads/2016/07/slider2-3.jpg"
                                    alt="HEARTY WELCOMES WITH"
                                  />
                                  <div className="owl-caption">
                                    <div className="container">
                                      <div className="content-block">
                                        <h2>
                                          <span className="text-bold">
                                            HEARTY WELCOMES WITH
                                          </span>{' '}
                                          <br />
                                          <span className="text-light">
                                            A TOUCH OF RIVALRY
                                          </span>
                                        </h2>
                                        <a
                                          href="index.html%3Fp=67.html"
                                          className="bnt bnt-theme read-story"
                                        >
                                          READ STORY
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="item">
                                  <img
                                    decoding="async"
                                    src="wp-content/uploads/2016/07/slider4-3.jpg"
                                    alt="Alumni Interview"
                                  />
                                  <div className="owl-caption">
                                    <div className="container">
                                      <div className="content-block">
                                        <h2>
                                          <span className="text-bold">
                                            Alumni Interview
                                          </span>{' '}
                                          <br />
                                          <span className="text-light">
                                            Hannah Jordan
                                          </span>
                                        </h2>
                                        <a
                                          href="index.html%3Fp=67.html"
                                          className="bnt bnt-theme read-story"
                                        >
                                          READ STORY
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="item">
                                  <img
                                    decoding="async"
                                    src="wp-content/uploads/2016/07/slider1-3.jpg"
                                    alt="Alumni Interview"
                                  />
                                  <div className="owl-caption">
                                    <div className="container">
                                      <div className="content-block">
                                        <h2>
                                          <span className="text-bold">
                                            Alumni Interview
                                          </span>{' '}
                                          <br />
                                          <span className="text-light">
                                            Hannah Jordan
                                          </span>
                                        </h2>
                                        <a
                                          href="index.html%3Fp=2030.html#"
                                          className="bnt bnt-theme read-story"
                                        >
                                          READ STORY
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!--end slider--> */}
                          </div>
                        </div>
                        <div
                          id="panel-2146-0-0-1"
                          className="so-panel widget_sayidan_singleevent_widget"
                          data-index="1"
                          data-style='{"background_image_attachment":false,"background_display":"tile"}'
                        >
                          <div className="so-widget-sayidan_singleevent_widget so-widget-sayidan_singleevent_widget-default-d75171398898"></div>
                        </div>
                        <div
                          id="panel-2146-0-0-2"
                          className="so-panel widget_sayidan_info_widget"
                          data-index="2"
                          data-style='{"background_display":"tile"}'
                        >
                          <div className="so-widget-sayidan_info_widget so-widget-sayidan_info_widget-default-d75171398898">
                            {/* <!--begin alumni dashboard--> */}
                            <div className="alumni-dashboard">
                              <div className="container">
                                <div className="title title-dashboard type1">
                                  <h3 className="heading-light no-margin">
                                    My Sayidan Alumni Dashboard
                                  </h3>
                                </div>
                                <div className="area-content">
                                  <div className="row">
                                    <div className="col-md-3 col-sm-6 col-xs-12">
                                      <div className="icon mail-icon"></div>
                                      <div className="box-content">
                                        <h4 className="heading-regular">
                                          Checking Message
                                        </h4>
                                        <p className="text-content text-margin text-light ">
                                          Claritas est etiam processus
                                          dynamicus, qui sequitur mutationem
                                          consuetudium lectorum. Mirum est
                                          notare quam.{' '}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="col-md-3 col-sm-6 col-xs-12">
                                      <div className="icon account-icon"></div>
                                      <div className="box-content">
                                        <h4 className="heading-regular">
                                          Update My Information
                                        </h4>
                                        <p className="text-content text-margin text-light ">
                                          Claritas est etiam processus
                                          dynamicus, qui sequitur mutationem
                                          consuetudium lectorum. Mirum est
                                          notare quam.{' '}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="col-md-3 col-sm-6 col-xs-12">
                                      <div className="icon group-icon"></div>
                                      <div className="box-content">
                                        <h4 className="heading-regular">
                                          Join with Alumni Forum
                                        </h4>
                                        <p className="text-content text-margin text-light ">
                                          Claritas est etiam processus
                                          dynamicus, qui sequitur mutationem
                                          consuetudium lectorum. Mirum est
                                          notare quam.{' '}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="col-md-3 col-sm-6 col-xs-12">
                                      <div className="icon search-icon"></div>
                                      <div className="box-content">
                                        <h4 className="heading-regular">
                                          Search Alumni Directory
                                        </h4>
                                        <p className="text-content text-margin text-light ">
                                          Claritas est etiam processus
                                          dynamicus, qui sequitur mutationem
                                          consuetudium lectorum. Mirum est
                                          notare quam.{' '}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="login-dashboard text-center col-sm-12 col-xs-12">
                                      <a
                                        href="login/index.html"
                                        className="bnt bnt-theme login-links"
                                      >
                                        LOG IN TO ALUMNI DASHBOARD
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!--end alumni dashboard--> */}
                          </div>
                        </div>
                        <div
                          id="panel-2146-0-0-3"
                          className="so-panel widget_sayidan_blocks_widget"
                          data-index="3"
                          data-style='{"background_display":"tile"}'
                        >
                          <div className="so-widget-sayidan_blocks_widget so-widget-sayidan_blocks_widget-default-d75171398898">
                            {' '}
                            <div className="block-links">
                              <div className="container">
                                <div className="row">
                                  <div className="block-news col-md-4 col-sm-12 col-xs-12">
                                    <div className="column-news">
                                      <div className="title-links">
                                        <h3 className="heading-regular">
                                          Latest News
                                        </h3>
                                      </div>
                                      <div className="post-wrapper">
                                        <div className="post-item clearfix">
                                          <div className="image-frame post-photo-wrapper">
                                            <a href="index.html%3Fp=44.html">
                                              {' '}
                                              <img
                                                decoding="async"
                                                width="262"
                                                height="179"
                                                src="wp-content/uploads/2016/07/galery-popup-10-3-262x179.jpg"
                                                className="img-responsive wp-post-image"
                                                alt=""
                                              />{' '}
                                            </a>
                                          </div>
                                          <div className="post-desc-wrapper ">
                                            <div className="post-desc">
                                              <div className="post-title">
                                                <h6 className="heading-regular">
                                                  <a href="index.html%3Fp=44.html">
                                                    Objectives Should Be Stated
                                                    Clearly
                                                  </a>
                                                </h6>
                                              </div>
                                              <div className="post-excerpt">
                                                <p>
                                                  Duis autem vel eum iriure
                                                  dolor in hendrerit[...]
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="post-item clearfix">
                                          <div className="image-frame post-photo-wrapper">
                                            <a href="index.html%3Fp=36.html">
                                              {' '}
                                              <img
                                                decoding="async"
                                                width="262"
                                                height="179"
                                                src="wp-content/uploads/2016/07/shutterstock_287328122-3-262x179.jpg"
                                                className="img-responsive wp-post-image"
                                                alt=""
                                              />{' '}
                                            </a>
                                          </div>
                                          <div className="post-desc-wrapper ">
                                            <div className="post-desc">
                                              <div className="post-title">
                                                <h6 className="heading-regular">
                                                  <a href="index.html%3Fp=36.html">
                                                    It Was My Best Experience
                                                  </a>
                                                </h6>
                                              </div>
                                              <div className="post-excerpt">
                                                <p>
                                                  Claritas est etiam processus
                                                  dynamicus, qui sequitur
                                                  mutationem[...]
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="post-item clearfix">
                                          <div className="image-frame post-photo-wrapper">
                                            <a href="index.html%3Fp=42.html">
                                              {' '}
                                              <img
                                                decoding="async"
                                                width="262"
                                                height="179"
                                                src="wp-content/uploads/2016/07/shutterstock_282059522-3-3-262x179.jpg"
                                                className="img-responsive wp-post-image"
                                                alt=""
                                              />{' '}
                                            </a>
                                          </div>
                                          <div className="post-desc-wrapper ">
                                            <div className="post-desc">
                                              <div className="post-title">
                                                <h6 className="heading-regular">
                                                  <a href="index.html%3Fp=42.html">
                                                    Lorem Ipsum Story of My
                                                  </a>
                                                </h6>
                                              </div>
                                              <div className="post-excerpt">
                                                <p>
                                                  Duis autem vel eum iriure
                                                  dolor in hendrerit[...]
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="post-item clearfix">
                                          <div className="image-frame post-photo-wrapper">
                                            <a href="index.html%3Fp=38.html">
                                              {' '}
                                              <img
                                                loading="lazy"
                                                decoding="async"
                                                width="262"
                                                height="179"
                                                src="wp-content/uploads/2016/07/shutterstock_225762442-3-262x179.jpg"
                                                className="img-responsive wp-post-image"
                                                alt=""
                                              />{' '}
                                            </a>
                                          </div>
                                          <div className="post-desc-wrapper ">
                                            <div className="post-desc">
                                              <div className="post-title">
                                                <h6 className="heading-regular">
                                                  <a href="index.html%3Fp=38.html">
                                                    World Level Mentors And
                                                    Tutors
                                                  </a>
                                                </h6>
                                              </div>
                                              <div className="post-excerpt">
                                                <p>
                                                  Mirum est notare quam littera
                                                  gothica, quam nunc[...]
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="view-all">
                                        <a href="blog/index.html">
                                          View All News
                                        </a>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="block-career col-md-4 col-sm-12 col-xs-12">
                                    <div className="column-career">
                                      <div className="title-links">
                                        <h3 className="heading-regular">
                                          Career Opportunity
                                        </h3>
                                      </div>
                                      <div className="career-content">
                                        <div className="company-item clearfix">
                                          <div className="company-logo">
                                            <a href="index.html%3Fp=176.html">
                                              <img
                                                loading="lazy"
                                                decoding="async"
                                                width="391"
                                                height="67"
                                                src="wp-content/uploads/2016/07/procera-logo-edited-3.png"
                                                className="img-responsive wp-post-image"
                                                alt=""
                                                // srcset="wp-content/uploads/2016/07/procera-logo-edited-3.png 391w, wp-content/uploads/2016/07/procera-logo-edited-3-300x51.png 300w"
                                                sizes="(max-width: 391px) 100vw, 391px"
                                              />
                                            </a>
                                          </div>
                                          <div className="company-desc-wrapper">
                                            <div className="company-desc">
                                              <div className="company-title">
                                                <h6 className="heading-regular">
                                                  <a href="index.html%3Fp=176.html">
                                                    Technical Director
                                                  </a>
                                                </h6>
                                              </div>
                                              <div className="company-excerpt">
                                                <p>
                                                  Claritas est etiam processus
                                                  dynamicus, qui sequitur
                                                  mutationem[...]
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="company-item clearfix">
                                          <div className="company-logo">
                                            <a href="index.html%3Fp=173.html">
                                              <img
                                                loading="lazy"
                                                decoding="async"
                                                width="350"
                                                height="113"
                                                src="wp-content/uploads/2016/07/Salsify_Logo_Blue_Flower_Gray_Text-01-3.png"
                                                className="img-responsive wp-post-image"
                                                alt=""
                                                // srcset="wp-content/uploads/2016/07/Salsify_Logo_Blue_Flower_Gray_Text-01-3.png 350w, wp-content/uploads/2016/07/Salsify_Logo_Blue_Flower_Gray_Text-01-3-300x97.png 300w"
                                                sizes="(max-width: 350px) 100vw, 350px"
                                              />
                                            </a>
                                          </div>
                                          <div className="company-desc-wrapper">
                                            <div className="company-desc">
                                              <div className="company-title">
                                                <h6 className="heading-regular">
                                                  <a href="index.html%3Fp=173.html">
                                                    Assistant
                                                  </a>
                                                </h6>
                                              </div>
                                              <div className="company-excerpt">
                                                <p>
                                                  Claritas est etiam processus
                                                  dynamicus, qui sequitur
                                                  mutationem[...]
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="company-item clearfix">
                                          <div className="company-logo">
                                            <a href="index.html%3Fp=170.html">
                                              <img
                                                loading="lazy"
                                                decoding="async"
                                                width="350"
                                                height="115"
                                                src="wp-content/uploads/2016/07/navia-logo-final-300-rgb_gradient-fullcolor-mark-type-tag-3.png"
                                                className="img-responsive wp-post-image"
                                                alt=""
                                                // srcset="wp-content/uploads/2016/07/navia-logo-final-300-rgb_gradient-fullcolor-mark-type-tag-3.png 350w, wp-content/uploads/2016/07/navia-logo-final-300-rgb_gradient-fullcolor-mark-type-tag-3-300x99.png 300w"
                                                sizes="(max-width: 350px) 100vw, 350px"
                                              />
                                            </a>
                                          </div>
                                          <div className="company-desc-wrapper">
                                            <div className="company-desc">
                                              <div className="company-title">
                                                <h6 className="heading-regular">
                                                  <a href="index.html%3Fp=170.html">
                                                    Developer
                                                  </a>
                                                </h6>
                                              </div>
                                              <div className="company-excerpt">
                                                <p>
                                                  Claritas est etiam processus
                                                  dynamicus, qui sequitur
                                                  mutationem[...]
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="company-item clearfix">
                                          <div className="company-logo">
                                            <a href="index.html%3Fp=167.html">
                                              <img
                                                loading="lazy"
                                                decoding="async"
                                                width="350"
                                                height="105"
                                                src="wp-content/uploads/2016/07/chargify-logo-dark-37df595c-3.png"
                                                className="img-responsive wp-post-image"
                                                alt=""
                                                // srcset="wp-content/uploads/2016/07/chargify-logo-dark-37df595c-3.png 350w, wp-content/uploads/2016/07/chargify-logo-dark-37df595c-3-300x90.png 300w"
                                                sizes="(max-width: 350px) 100vw, 350px"
                                              />
                                            </a>
                                          </div>
                                          <div className="company-desc-wrapper">
                                            <div className="company-desc">
                                              <div className="company-title">
                                                <h6 className="heading-regular">
                                                  <a href="index.html%3Fp=167.html">
                                                    Manager
                                                  </a>
                                                </h6>
                                              </div>
                                              <div className="company-excerpt">
                                                <p>
                                                  Claritas est etiam processus
                                                  dynamicus, qui sequitur
                                                  mutationem[...]
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="view-all">
                                        <a href="career-opportunity/page/1/index.html">
                                          View All Career Opportunities
                                        </a>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="block-event-calendar col-md-4 col-sm-12 col-xs-12">
                                    <div className="column-calendar">
                                      <div className="title-links">
                                        <h3 className="heading-regular">
                                          Event Calendar
                                        </h3>
                                      </div>

                                      <div className="content-calendar bg-calendar no-padding">
                                        <div className="top-section">
                                          <h6 className="heading-light">
                                            December 2023
                                          </h6>
                                          <span className="icon calendar-icon pull-right"></span>
                                        </div>
                                        <div className="list-view">
                                          <div className="view-item">
                                            <div className="date-item">
                                              <span className="dates text-light">
                                                Sun
                                              </span>
                                              <span className="day text-bold color-theme">
                                                31
                                              </span>
                                              <span className="month text-light">
                                                Dec
                                              </span>
                                            </div>
                                            <div className="date-desc-wrapper">
                                              <div className="date-desc">
                                                <div className="date-title">
                                                  <h6 className="heading-regular">
                                                    <a href="index.html%3Fp=2322.html">
                                                      Alumni Association White
                                                      Hall Exhibition
                                                    </a>
                                                  </h6>
                                                </div>
                                                <div className="date-excerpt">
                                                  <p>
                                                    Duis autem vel eum iriure
                                                    dolor in hendrerit[...]
                                                  </p>
                                                </div>
                                                <div className="place">
                                                  <span className="icon map-icon"></span>
                                                  <span className="text-place">
                                                    Findlancer Terrace,
                                                    Gondosuli, California
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="view-item">
                                            <div className="date-item">
                                              <span className="dates text-light">
                                                Mon
                                              </span>
                                              <span className="day text-bold color-theme">
                                                04
                                              </span>
                                              <span className="month text-light">
                                                Dec
                                              </span>
                                            </div>
                                            <div className="date-desc-wrapper">
                                              <div className="date-desc">
                                                <div className="date-title">
                                                  <h6 className="heading-regular">
                                                    <a href="index.html%3Fp=218.html">
                                                      Annual Meet Up And
                                                      Scholarship
                                                    </a>
                                                  </h6>
                                                </div>
                                                <div className="date-excerpt">
                                                  <p>
                                                    Duis autem vel eum iriure
                                                    dolor in hendrerit[...]
                                                  </p>
                                                </div>
                                                <div className="place">
                                                  <span className="icon map-icon"></span>
                                                  <span className="text-place">
                                                    Sayidan Street, Gondomanan,
                                                    8993, San Francisco, CA
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="view-item">
                                            <div className="date-item">
                                              <span className="dates text-light">
                                                Tue
                                              </span>
                                              <span className="day text-bold color-theme">
                                                07
                                              </span>
                                              <span className="month text-light">
                                                Nov
                                              </span>
                                            </div>
                                            <div className="date-desc-wrapper">
                                              <div className="date-desc">
                                                <div className="date-title">
                                                  <h6 className="heading-regular">
                                                    <a href="index.html%3Fp=249.html">
                                                      Annual meetup and
                                                      scholarship presentation
                                                    </a>
                                                  </h6>
                                                </div>
                                                <div className="date-excerpt">
                                                  <p>
                                                    Duis autem vel eum iriure
                                                    dolor in hendrerit[...]
                                                  </p>
                                                </div>
                                                <div className="place">
                                                  <span className="icon map-icon"></span>
                                                  <span className="text-place">
                                                    363 Oakwood Avenue Irmo, SC
                                                    29063
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="view-item">
                                            <div className="date-item">
                                              <span className="dates text-light">
                                                Thu
                                              </span>
                                              <span className="day text-bold color-theme">
                                                17
                                              </span>
                                              <span className="month text-light">
                                                Nov
                                              </span>
                                            </div>
                                            <div className="date-desc-wrapper">
                                              <div className="date-desc">
                                                <div className="date-title">
                                                  <h6 className="heading-regular">
                                                    <a href="index.html%3Fp=226.html">
                                                      Club Sponsorship 2022-2023
                                                    </a>
                                                  </h6>
                                                </div>
                                                <div className="date-excerpt">
                                                  <p>
                                                    Duis autem vel eum iriure
                                                    dolor in hendrerit[...]
                                                  </p>
                                                </div>
                                                <div className="place">
                                                  <span className="icon map-icon"></span>
                                                  <span className="text-place">
                                                    727 South Roehampton Ave.
                                                    Fuquay Varina, NC 27526
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="view-item">
                                            <div className="date-item">
                                              <span className="dates text-light">
                                                Wed
                                              </span>
                                              <span className="day text-bold color-theme">
                                                02
                                              </span>
                                              <span className="month text-light">
                                                Nov
                                              </span>
                                            </div>
                                            <div className="date-desc-wrapper">
                                              <div className="date-desc">
                                                <div className="date-title">
                                                  <h6 className="heading-regular">
                                                    <a href="index.html%3Fp=234.html">
                                                      Soap Sporting at Clean The
                                                    </a>
                                                  </h6>
                                                </div>
                                                <div className="date-excerpt">
                                                  <p>
                                                    Duis autem vel eum iriure
                                                    dolor in hendrerit[...]
                                                  </p>
                                                </div>
                                                <div className="place">
                                                  <span className="icon map-icon"></span>
                                                  <span className="text-place">
                                                    44 Arrowhead Street
                                                    Londonderry, NH 03053
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="view-item">
                                            <div className="date-item">
                                              <span className="dates text-light">
                                                Wed
                                              </span>
                                              <span className="day text-bold color-theme">
                                                24
                                              </span>
                                              <span className="month text-light">
                                                Aug
                                              </span>
                                            </div>
                                            <div className="date-desc-wrapper">
                                              <div className="date-desc">
                                                <div className="date-title">
                                                  <h6 className="heading-regular">
                                                    <a href="index.html%3Fp=230.html">
                                                      Soap Sporting at Clean The
                                                    </a>
                                                  </h6>
                                                </div>
                                                <div className="date-excerpt">
                                                  <p>
                                                    Duis autem vel eum iriure
                                                    dolor in hendrerit[...]
                                                  </p>
                                                </div>
                                                <div className="place">
                                                  <span className="icon map-icon"></span>
                                                  <span className="text-place">
                                                    363 Oakwood Avenue Irmo, SC
                                                    29063
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="view-item">
                                            <div className="date-item">
                                              <span className="dates text-light">
                                                Tue
                                              </span>
                                              <span className="day text-bold color-theme">
                                                23
                                              </span>
                                              <span className="month text-light">
                                                Aug
                                              </span>
                                            </div>
                                            <div className="date-desc-wrapper">
                                              <div className="date-desc">
                                                <div className="date-title">
                                                  <h6 className="heading-regular">
                                                    <a href="index.html%3Fp=228.html">
                                                      Weekend at Sayidan Sierra
                                                      Camp
                                                    </a>
                                                  </h6>
                                                </div>
                                                <div className="date-excerpt">
                                                  <p>
                                                    Duis autem vel eum iriure
                                                    dolor in hendrerit[...]
                                                  </p>
                                                </div>
                                                <div className="place">
                                                  <span className="icon map-icon"></span>
                                                  <span className="text-place">
                                                    160 Market St. Mays Landing,
                                                    NJ 08330
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="view-item">
                                            <div className="date-item">
                                              <span className="dates text-light">
                                                Thu
                                              </span>
                                              <span className="day text-bold color-theme">
                                                18
                                              </span>
                                              <span className="month text-light">
                                                Mar
                                              </span>
                                            </div>
                                            <div className="date-desc-wrapper">
                                              <div className="date-desc">
                                                <div className="date-title">
                                                  <h6 className="heading-regular">
                                                    <a href="index.html%3Fp=232.html">
                                                      Annual Meetup at Luncheon
                                                    </a>
                                                  </h6>
                                                </div>
                                                <div className="date-excerpt">
                                                  <p>
                                                    Duis autem vel eum iriure
                                                    dolor in hendrerit[...]
                                                  </p>
                                                </div>
                                                <div className="place">
                                                  <span className="icon map-icon"></span>
                                                  <span className="text-place">
                                                    15 Blackburn Dr. Southgate,
                                                    MI 48195
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="view-item">
                                            <div className="date-item">
                                              <span className="dates text-light">
                                                Tue
                                              </span>
                                              <span className="day text-bold color-theme">
                                                03
                                              </span>
                                              <span className="month text-light">
                                                Mar
                                              </span>
                                            </div>
                                            <div className="date-desc-wrapper">
                                              <div className="date-desc">
                                                <div className="date-title">
                                                  <h6 className="heading-regular">
                                                    <a href="index.html%3Fp=236.html">
                                                      An Evening with Sayidan
                                                      Professor
                                                    </a>
                                                  </h6>
                                                </div>
                                                <div className="date-excerpt">
                                                  <p>
                                                    Duis autem vel eum iriure
                                                    dolor in hendrerit[...]
                                                  </p>
                                                </div>
                                                <div className="place">
                                                  <span className="icon map-icon"></span>
                                                  <span className="text-place">
                                                    273 Honey Creek Street
                                                    Kaukauna, WI 54130
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="view-all">
                                        <a href="index.html%3Fp=2030.html#">
                                          View All Events
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id="panel-2146-0-0-4"
                          className="so-panel widget_sayidan_banner_widget"
                          data-index="4"
                          data-style='{"background_display":"tile"}'
                        >
                          <div className="so-widget-sayidan_banner_widget so-widget-sayidan_banner_widget-default-d75171398898">
                            <div
                              className="alumni-interview"
                              style="background: url('wp-content/uploads/2016/07/bg-home-3.jpg') no-repeat;"
                            >
                              <div className="container">
                                <div className="row">
                                  <div className="col-sm-6 col-xs-12 pull-right">
                                    <div className="interview-wrapper">
                                      <div className="interview-title animated lightSpeedIn">
                                        <h4 className="heading-light text-capitalize">
                                          Alumni Interview
                                        </h4>
                                        <h1 className="heading-light text-capitalize">
                                          Hannah Jordan
                                        </h1>
                                      </div>
                                      <div className="interview-desc text-left animated rollIn">
                                        <p className="text-light">
                                          Claritas est etiam processus
                                          dynamicus, qui sequitur mutationem
                                          consuetudium lectorum. Mirum est
                                          notare quam littera gothica, quam nunc
                                          putamus parum claram, anteposuerit
                                          litterarum formas humanitatis per
                                          seacula quarta decima et quinta
                                          decima.
                                        </p>
                                      </div>
                                      <div className="interview-see-story animated zoomInLeft">
                                        <a
                                          className="see-story bnt text-uppercase"
                                          href="index.html%3Fp=44.html"
                                        >
                                          SEE HANNAH STORY
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!--end alumni stories--> */}
                          </div>
                        </div>
                        <div
                          id="panel-2146-0-0-5"
                          className="so-panel widget_sayidan_twitter2_widget"
                          data-index="5"
                          data-style='{"background_image_attachment":false,"background_display":"tile"}'
                        >
                          <div className="so-widget-sayidan_twitter2_widget so-widget-sayidan_twitter2_widget-default-d75171398898">
                            {/* <!--begin twitter stream--> */}
                            <div className="twitter-stream">
                              <div className="container">
                                <div className="twitter-wrapper text-center">
                                  <div className="twitter-icon color-theme">
                                    <i
                                      className="fa fa-twitter"
                                      aria-hidden="true"
                                    ></i>
                                  </div>
                                  <div className="twitter-content">
                                    <div className="twitter-desc">
                                      <p className="text-light text-center">
                                        “I feel fortunate to be joining my
                                        classmates in welcoming the Class of
                                        2024 to the Sayidan alumni community{' '}
                                        <a href="index.html%3Fp=2030.html#">
                                          @SayidanEdu
                                        </a>
                                        “
                                      </p>
                                      <div className="twitter-user">
                                        <span className="avatar-user">
                                          <img
                                            decoding="async"
                                            src="https://sayidan.kenzap.com/images/avatar.png"
                                            alt=""
                                          />
                                        </span>
                                        <span className="name">@sayidan</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!--end twitter stream--> */}
                          </div>
                        </div>
                        <div
                          id="panel-2146-0-0-6"
                          className="so-panel widget_sayidan_gallery_widget"
                          data-index="6"
                          data-style='{"background_image_attachment":false,"background_display":"tile"}'
                        >
                          <div className="so-widget-sayidan_gallery_widget so-widget-sayidan_gallery_widget-default-d75171398898">
                            {/* <!--begin instagream--> */}
                            <div className="instagream">
                              <div className="instagram-feed clearfix">
                                <ul className="list-item no-margin">
                                  <li
                                    className="no-padding no-margin no-style"
                                    style="width:16.666666666667%"
                                  >
                                    <a href="university-gallery.html">
                                      <img
                                        loading="lazy"
                                        decoding="async"
                                        width="290"
                                        height="290"
                                        src="wp-content/uploads/2016/07/galery-popup-15-3-290x290.jpg"
                                        className="img-responsive wp-post-image"
                                        alt=""
                                        // srcset="wp-content/uploads/2016/07/galery-popup-15-3-290x290.jpg 290w, wp-content/uploads/2016/07/galery-popup-15-3-150x150.jpg 150w, wp-content/uploads/2016/07/galery-popup-15-3-93x93.jpg 93w"
                                        sizes="(max-width: 290px) 100vw, 290px"
                                      />
                                    </a>
                                  </li>
                                  <li
                                    className="no-padding no-margin no-style"
                                    style="width:16.666666666667%"
                                  >
                                    <a href="university-gallery.html">
                                      <img
                                        loading="lazy"
                                        decoding="async"
                                        width="290"
                                        height="290"
                                        src="wp-content/uploads/2016/07/single-event-img-3-290x290.jpg"
                                        className="img-responsive wp-post-image"
                                        alt=""
                                        // srcset="wp-content/uploads/2016/07/single-event-img-3-290x290.jpg 290w, wp-content/uploads/2016/07/single-event-img-3-150x150.jpg 150w, wp-content/uploads/2016/07/single-event-img-3-93x93.jpg 93w"
                                        sizes="(max-width: 290px) 100vw, 290px"
                                      />
                                    </a>
                                  </li>
                                  <li
                                    className="no-padding no-margin no-style"
                                    style="width:16.666666666667%"
                                  >
                                    <a href="university-gallery.html">
                                      <img
                                        loading="lazy"
                                        decoding="async"
                                        width="290"
                                        height="290"
                                        src="wp-content/uploads/2016/07/galery-popup-10-3-290x290.jpg"
                                        className="img-responsive wp-post-image"
                                        alt=""
                                        // srcset="wp-content/uploads/2016/07/galery-popup-10-3-290x290.jpg 290w, wp-content/uploads/2016/07/galery-popup-10-3-150x150.jpg 150w, wp-content/uploads/2016/07/galery-popup-10-3-93x93.jpg 93w"
                                        sizes="(max-width: 290px) 100vw, 290px"
                                      />
                                    </a>
                                  </li>
                                  <li
                                    className="no-padding no-margin no-style"
                                    style="width:16.666666666667%"
                                  >
                                    <a href="university-gallery.html">
                                      <img
                                        loading="lazy"
                                        decoding="async"
                                        width="290"
                                        height="290"
                                        src="wp-content/uploads/2016/07/galery-popup-16-1-3-290x290.jpg"
                                        className="img-responsive wp-post-image"
                                        alt=""
                                        // srcset="wp-content/uploads/2016/07/galery-popup-16-1-3-290x290.jpg 290w, wp-content/uploads/2016/07/galery-popup-16-1-3-150x150.jpg 150w, wp-content/uploads/2016/07/galery-popup-16-1-3-93x93.jpg 93w"
                                        sizes="(max-width: 290px) 100vw, 290px"
                                      />
                                    </a>
                                  </li>
                                  <li
                                    className="no-padding no-margin no-style"
                                    style="width:16.666666666667%"
                                  >
                                    <a href="university-gallery.html">
                                      <img
                                        loading="lazy"
                                        decoding="async"
                                        width="290"
                                        height="290"
                                        src="wp-content/uploads/2016/07/galery-popup-11-3-290x290.jpg"
                                        className="img-responsive wp-post-image"
                                        alt=""
                                        // srcset="wp-content/uploads/2016/07/galery-popup-11-3-290x290.jpg 290w, wp-content/uploads/2016/07/galery-popup-11-3-150x150.jpg 150w, wp-content/uploads/2016/07/galery-popup-11-3-93x93.jpg 93w"
                                        sizes="(max-width: 290px) 100vw, 290px"
                                      />
                                    </a>
                                  </li>
                                  <li
                                    className="no-padding no-margin no-style"
                                    style="width:16.666666666667%"
                                  >
                                    <a href="university-gallery.html">
                                      <img
                                        loading="lazy"
                                        decoding="async"
                                        width="290"
                                        height="290"
                                        src="wp-content/uploads/2016/07/galery-popup-12-3-290x290.jpg"
                                        className="img-responsive wp-post-image"
                                        alt=""
                                        // srcset="wp-content/uploads/2016/07/galery-popup-12-3-290x290.jpg 290w, wp-content/uploads/2016/07/galery-popup-12-3-150x150.jpg 150w, wp-content/uploads/2016/07/galery-popup-12-3-93x93.jpg 93w"
                                        sizes="(max-width: 290px) 100vw, 290px"
                                      />
                                    </a>
                                  </li>
                                </ul>
                                <div className="instagram-feed-user text-center">
                                  <div className="user-wrapper">
                                    <span className="icon-instagram">
                                      <i
                                        className="fa fa-instagram"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                    <span className="name-user">
                                      @SayidanEdu
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!--end instagream--> */}
                          </div>
                        </div>
                        <div
                          id="panel-2146-0-0-7"
                          className="so-panel widget_sayidan_newsletter_widget panel-last-child"
                          data-index="7"
                          data-style='{"background_display":"tile"}'
                        >
                          <div className="so-widget-sayidan_newsletter_widget so-widget-sayidan_newsletter_widget-default-d75171398898">
                            {/* <!--begin newsletter--> */}
                            <div
                              className="newsletter newsletter-parallax type2"
                              data-parallax="scroll"
                              data-image-src="https://sayidan.kenzap.com/wp-content/uploads/2016/07/bg-newsletter4-3.jpg"
                            >
                              <div className="container">
                                <div className="newsletter-wrapper text-center">
                                  <div className="newsletter-title">
                                    <h2 className="heading-light">
                                      Don’t Miss Awesome Story From Our Alumni
                                    </h2>
                                    <p className="text-light">
                                      Duis autem vel eum iriure dolor in
                                      hendrerit in vulputate.
                                    </p>
                                  </div>
                                  <script>
                                    (function(){' '}
                                    {
                                      (window.mc4wp = window.mc4wp || {
                                        listeners: [],
                                        forms: {
                                          on: function (evt, cb) {
                                            window.mc4wp.listeners.push({
                                              event: evt,
                                              callback: cb,
                                            });
                                          },
                                        },
                                      })
                                    }
                                    )();
                                  </script>
                                  {/* <!-- Mailchimp for WordPress v4.9.10 - https://wordpress.org/plugins/mailchimp-for-wp/ --> */}
                                  <form
                                    id="mc4wp-form-1"
                                    className="mc4wp-form mc4wp-form-600"
                                    method="post"
                                    data-id="600"
                                    data-name="Subscription"
                                  >
                                    <div className="mc4wp-form-fields">
                                      <div className="form-inline">
                                        <input
                                          type="text"
                                          className="form-control text-center form-text-light"
                                          name="EMAIL"
                                          value=""
                                          placeholder="Your E-mail address"
                                        />
                                        <button
                                          type="submit"
                                          className="button bnt-theme"
                                        >
                                          SUBSCRIBE
                                        </button>
                                      </div>
                                    </div>
                                    <label style="display: none !important;">
                                      Leave this field empty if youre human:{' '}
                                      <input
                                        type="text"
                                        name="_mc4wp_honeypot"
                                        value=""
                                        // tabindex="-1"
                                        // autocomplete="off"
                                      />
                                    </label>
                                    <input
                                      type="hidden"
                                      name="_mc4wp_timestamp"
                                      value="1711737436"
                                    />
                                    <input
                                      type="hidden"
                                      name="_mc4wp_form_id"
                                      value="600"
                                    />
                                    <input
                                      type="hidden"
                                      name="_mc4wp_form_element_id"
                                      value="mc4wp-form-1"
                                    />
                                    <div className="mc4wp-response"></div>
                                  </form>
                                  {/* <!-- / Mailchimp for WordPress Plugin -->  */}
                                </div>
                              </div>
                            </div>
                            {/* <!--end newsletter--> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- .entry-content --> */}
            </article>
            {/* <!-- #post-## --> */}
          </div>
          {/* <!-- #primary --> */}
        </div>

        <div id="um_upload_single" style="display:none"></div>

        <div id="um_view_photo" style="display:none">
          <a
            href="javascript:void(0);"
            data-action="um_remove_modal"
            className="um-modal-close"
            aria-label="Close view photo modal"
          >
            <i className="um-faicon-times"></i>
          </a>

          <div className="um-modal-body photo">
            <div className="um-modal-photo"></div>
          </div>
        </div>
      </div>
    </>
  );
}
