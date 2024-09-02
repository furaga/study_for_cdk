import logo from './logo.svg';
// import './App.css';
import './css/main.css';
import './css/fontawesome-all.min.css';
import './css/noscript.css';

const AdamJensen = () => {
  return (
		<div id="wrapper">
			<div id="bg"></div>
			<div id="overlay"></div>
			<div id="main">

					<header id="header">
						<h1>Adam Jensen</h1>
						<p>Security Chief &nbsp;&bull;&nbsp; Cyborg &nbsp;&bull;&nbsp; Never asked for this</p>
						<nav>
							<ul>
								<li><a href="#" class="icon brands fa-twitter"><span class="label">Twitter</span></a></li>
								<li><a href="#" class="icon brands fa-facebook-f"><span class="label">Facebook</span></a></li>
								<li><a href="#" class="icon brands fa-dribbble"><span class="label">Dribbble</span></a></li>
								<li><a href="#" class="icon brands fa-github"><span class="label">Github</span></a></li>
								<li><a href="#" class="icon solid fa-envelope"><span class="label">Email</span></a></li>
							</ul>
						</nav>
					</header>

					<footer id="footer">
						<span class="copyright">&copy; Untitled. Design: <a href="http://html5up.net">HTML5 UP</a>.</span>
					</footer>

			</div>
		</div>
  );
};

function App() {
  return (
    <div className="App">
      <AdamJensen />
    </div>
  );
}

export default App;
