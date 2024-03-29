import type { ReactNode } from "react";
import type {
	Image,
	ScoreSuccessResponse,
	Student,
	StudentSuccessResponse,
	User,
} from "./apiType";

// alert dialog
interface AlertDialogProps {
	isOpen: boolean;
	message: string;
	isLoading: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

// button clipboard
interface ButtonClipboardProps {
	linkToCopy: string;
	children: ReactNode;
}

// breadcrumb
interface Breadcrumb {
	icon: string;
	label: string | undefined;
	path: string;
}
interface BreadcrumbState {
	breadcrumbs: Breadcrumb[];
}
interface BreadcrumbIconProps {
	name: string | undefined;
}

// toast
interface ToastState {
	isAllowed: boolean;
}
interface ToastProviderProps {
	children: ReactNode;
}

// header
interface HeaderContainerProps {
	title: string;
	subtitle: string;
	btnHref?: string;
	btnText?: string;
}

// student
interface StudentTableProps {
	student: Student[];
	refetchStudent: () => void;
}

// score
interface ScoreTableProps {
	scores: ScoreSuccessResponse | undefined;
	isLoading: boolean;
	isLargeView: boolean;
	isSuccess: boolean;
	isError: boolean;
	fetchScore: () => void;
}
interface UserScoreProps {
	isLoading: boolean;
	isLoadingGet: boolean;
	students: StudentSuccessResponse | undefined;
}
interface GameTableProps {
	scores: ScoreSuccessResponse | undefined;
	isLoading: boolean;
	isLoadingUser: boolean;
	isLargeView: boolean;
	isError: boolean;
	fetchScore: () => void;
	studentId: string | undefined;
	userData: StudentSuccessResponse | undefined;
}
interface GameTableState {
	id: string;
	name: string;
}
// profile
interface ProfileUserProps {
	user: User | undefined;
}
interface HeaderProfileProps {
	isProfilePage: boolean;
}

interface ModalDisplayProps {
	children: ReactNode;
	isOpen: boolean;
	onCloseModal: () => void;
	title: string;
}

interface PerformanceWidgetProps {
	activeItem?: number;
	countItem: number | undefined;
	children?: ReactNode;
	name: string;
	type: "simple" | "advanced";
	isError: boolean;
}

interface PerformanceChartProps {
	baseColor: string;
	currentvalue: number | undefined;
	totalValue: number | undefined;
}

interface ImageGalleryProps {
	images: Image[] | undefined;
	height: number;
}

interface GalleryPortalProps {
	images: Image[] | undefined;
	currentSlide: number;
	handleClose: () => void;
	prevSlide: () => void;
	nextSlide: () => void;
}

interface SearchActionsProps {
	onClickLink: (url: string) => void;
}

interface KbdProps {
	children: ReactNode;
}

interface SocialData {
	id: string;
	name: string;
	url: string;
	icon: ReactNode;
}

export type {
	AlertDialogProps,
	Breadcrumb,
	BreadcrumbState,
	BreadcrumbIconProps,
	ButtonClipboardProps,
	GalleryPortalProps,
	GameTableProps,
	GameTableState,
	HeaderContainerProps,
	HeaderProfileProps,
	ImageGalleryProps,
	KbdProps,
	ModalDisplayProps,
	PerformanceChartProps,
	PerformanceWidgetProps,
	ProfileUserProps,
	ScoreTableProps,
	SearchActionsProps,
	SocialData,
	StudentTableProps,
	ToastState,
	ToastProviderProps,
	UserScoreProps,
};
