import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const title = searchParams.get('title');
	const section = searchParams.get('section');

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					backgroundColor: '#000000'
				}}
			>
				<div
					style={{
						flex: 2,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center'
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							paddingLeft: 200
						}}
					>
						<h2
							style={{
								color: '#A1A1A9',
								textTransform: 'uppercase',
								fontSize: '1.2rem',
								margin: 0,
								fontWeight: 500
							}}
						>
							{section}
						</h2>
						<h1
							style={{
								color: '#FFFFFF',
								fontSize: '3rem',
								marginTop: 6
							}}
						>
							{title}
						</h1>

						<p
							style={{
								color: '#5C5C60',
								fontSize: '1.5rem',
								marginTop: 24
							}}
						>
							— BaseAI Documentation
						</p>
					</div>
				</div>
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<img
						alt="BaseAI"
						src="https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-icon.png"
						style={{
							width: 260,
							height: 260
						}}
					/>
					<h2
						style={{
							color: '#FFFFFF',
							fontSize: '2rem'
						}}
					>
						BaseAI
					</h2>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630
		}
	);
}
